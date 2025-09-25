"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    Card,
    Table,
    Input,
    Select,
    Space,
    Button,
    Tooltip
} from 'antd';
import { SearchOutlined, FilterOutlined } from '@ant-design/icons';

const { Option } = Select;

const DEBOUNCE_MS = 400;

function encodeState(obj) {
    return btoa(JSON.stringify(obj));
}

function decodeState(str) {
    try {
        return JSON.parse(atob(str));
    } catch {
        return {};
    }
}

const SearchableTable = ({
    title,
    data = [],
    columns = [],
    loading = false,
    searchFields = [], // Fields to search in: ['name', 'email', 'phone']
    searchPlaceholder = "Search...",
    filters = [], // [{ key: 'status', label: 'Status', options: [{ value: 'active', label: 'Active' }] }]
    tableProps = {},
    onRowAction = null, // Callback for row actions
    headerActions = null, // Additional header buttons
    customFilter = null, // Custom filter function (data, searchText, filters) => filteredData
    className = ""
}) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Read state from URL on mount
    const urlState = decodeState(searchParams.get("q") || "");

    const [searchText, setSearchText] = useState(urlState.search || '');
    const [activeFilters, setActiveFilters] = useState(urlState.filters || {});
    const [debouncedSearch, setDebouncedSearch] = useState(urlState.search || '');
    const [filteredData, setFilteredData] = useState(data);

    // Debounce search input
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedSearch(searchText), DEBOUNCE_MS);
        return () => clearTimeout(handler);
    }, [searchText]);

    // Update URL when debounced search or filters change
    useEffect(() => {
        const hasActiveFilters = Object.values(activeFilters).some(val => val && val !== 'all');
        
        if (debouncedSearch || hasActiveFilters) {
            const encoded = encodeState({
                search: debouncedSearch,
                filters: activeFilters
            });
            router.replace(`?q=${encoded}`, { scroll: false });
        } else {
            // Clear URL when no search or filters are active
            router.replace('', { scroll: false });
        }
    }, [debouncedSearch, activeFilters, router]);

    // Filter data whenever search, filters, or source data changes
    useEffect(() => {
        filterData(debouncedSearch, activeFilters);
    }, [debouncedSearch, activeFilters, data]);

    // Default filter function
    const defaultFilter = (sourceData, searchText, filters) => {
        let filtered = sourceData;

        // Apply text search
        if (searchText && searchFields.length > 0) {
            const searchLower = searchText.toLowerCase();
            filtered = filtered.filter(item =>
                searchFields.some(field => {
                    const value = field.split('.').reduce((obj, key) => obj?.[key], item);
                    return value?.toString().toLowerCase().includes(searchLower);
                })
            );
        }

        // Apply filters
        Object.entries(filters).forEach(([filterKey, filterValue]) => {
            if (filterValue && filterValue !== 'all') {
                filtered = filtered.filter(item => {
                    const itemValue = filterKey.split('.').reduce((obj, key) => obj?.[key], item);
                    return itemValue?.toString().toLowerCase() === filterValue.toLowerCase();
                });
            }
        });

        return filtered;
    };

    // Filter data function
    const filterData = (search, filters) => {
        const filterFunction = customFilter || defaultFilter;
        const filtered = filterFunction(data, search, filters);
        setFilteredData(filtered);
    };

    // Handle search input change
    const handleSearch = (value) => {
        setSearchText(value);
    };

    // Handle filter change
    const handleFilterChange = (filterKey, value) => {
        setActiveFilters(prev => ({
            ...prev,
            [filterKey]: value
        }));
    };

    // Clear all filters
    const clearFilters = () => {
        // Clear all state immediately
        setSearchText('');
        setActiveFilters({});
        setDebouncedSearch('');
        
        // Clear URL immediately (this will also trigger the useEffect)
        router.replace(window.location.pathname, { scroll: false });
        
        // Filter data with empty values immediately for instant feedback
        filterData('', {});
    };

    const hasActiveFilters = searchText || Object.values(activeFilters).some(val => val && val !== 'all');

    return (
        <div className={`space-y-4 ${className}`}>
            {/* Header Section */}
            {(title || headerActions) && (
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                    {title && (
                        <div>
                            <h1 className="text-2xl font-bold">{title}</h1>
                        </div>
                    )}
                    {headerActions && (
                        <div className="flex flex-wrap gap-2">
                            {headerActions}
                        </div>
                    )}
                </div>
            )}

            {/* Filters Section */}
            <Card className="shadow-sm">
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1">
                        <Input.Search
                            placeholder={searchPlaceholder}
                            value={searchText}
                            onChange={e => handleSearch(e.target.value)}
                            allowClear
                            style={{ maxWidth: 400 }}
                            size="large"
                            prefix={<SearchOutlined />}
                        />
                    </div>

                    {/* Filters */}
                    <div className="flex flex-wrap gap-2 items-center">
                        {filters.map(filter => (
                            <Select
                                key={filter.key}
                                placeholder={filter.label}
                                style={{ minWidth: 150 }}
                                size="large"
                                value={activeFilters[filter.key] || 'all'}
                                onChange={(value) => handleFilterChange(filter.key, value)}
                            >
                                <Option value="all">All {filter.label}</Option>
                                {filter.options.map(option => (
                                    <Option key={option.value} value={option.value}>
                                        {option.label}
                                    </Option>
                                ))}
                            </Select>
                        ))}

                        <Tooltip title="Clear all filters and search">
                            <Button
                                onClick={clearFilters}
                                icon={<FilterOutlined />}
                                type="text"
                                disabled={!hasActiveFilters}
                            >
                            </Button>
                        </Tooltip>

                    </div>
                </div>

                {/* Results count */}
                {hasActiveFilters && (
                    <div className="mt-3 text-sm text-gray-500">
                        Showing {filteredData.length} of {data.length} results
                    </div>
                )}
            </Card>

            {/* Table */}
            <Card className="shadow-sm">
                <Table
                    columns={columns}
                    dataSource={filteredData}
                    loading={loading}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) =>
                            `${range[0]}-${range[1]} of ${total} items`,
                        ...tableProps.pagination
                    }}
                    scroll={{ x: 1200 }}
                    size="middle"
                    {...tableProps}
                />
            </Card>
        </div>
    );
};

export default SearchableTable;
