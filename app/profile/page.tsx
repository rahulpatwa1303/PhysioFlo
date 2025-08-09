"use client";
import SimpleLayout from "../components/SimpleLayout";
import PageLoader from "../components/PageLoader";
import { useEffect, useState } from "react";
import { Card, Row, Col, Typography, Avatar, Button, Form, Input, message, Space, Divider, Upload } from "antd";
import { UserOutlined, EditOutlined, SaveOutlined, CameraOutlined } from "@ant-design/icons";
import { createClient } from "@supabase/supabase-js";

const { Title, Text } = Typography;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface DoctorProfile {
  id?: string;
  name: string;
  email: string;
  specialization?: string;
  experience?: string;
  phone?: string;
  clinic?: string;
  qualifications?: string;
  address?: string;
  registrationNumber?: string;
  about?: string;
  avatar?: string;
  created_at?: string;
  updated_at?: string;
}

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<DoctorProfile>({
    name: "",
    email: "",
    specialization: "Physiotherapist",
    experience: "PhysioFlow Practitioner",
    phone: "",
    clinic: "",
    qualifications: "",
    address: "",
    registrationNumber: "",
    about: "",
    avatar: undefined
  });
  const [form] = Form.useForm();

  useEffect(() => {
    const initProfile = async () => {
      const session = await supabase.auth.getSession();
      const uid = session.data.session?.user.id || null;
      const userEmail = session.data.session?.user.email || "";
      
      setUserId(uid);
      
      if (uid && userEmail) {
        await loadProfile(uid, userEmail);
      }
      setLoading(false);
    };
    initProfile();
  }, []);

  const loadProfile = async (uid: string, userEmail: string) => {
    try {
      // Fetch profile from Supabase
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', uid)
        .single();

      if (error && error.code !== 'PGRST116') {
        // PGRST116 is "not found" error, which is expected for new users
        throw error;
      }

      let profile: DoctorProfile;
      if (profileData && profileData.name) {
        // Profile exists in database
        profile = {
          id: profileData.id,
          name: profileData.name || "",
          email: userEmail,
          specialization: profileData.specialization || "Physiotherapist",
          experience: profileData.experience || "PhysioFlow Practitioner",
          phone: profileData.phone || "",
          clinic: profileData.clinic || "",
          qualifications: profileData.qualifications || "",
          address: profileData.address || "",
          registrationNumber: profileData.registration_number || "",
          about: profileData.about || "",
          avatar: profileData.avatar || undefined,
          created_at: profileData.created_at,
          updated_at: profileData.updated_at
        };
      } else {
        // No profile found or incomplete, create default
        profile = {
          id: uid,
          name: userEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          email: userEmail,
          specialization: "Physiotherapist",
          experience: "PhysioFlow Practitioner",
          phone: "",
          clinic: "",
          qualifications: "",
          address: "",
          registrationNumber: "",
          about: "",
          avatar: undefined
        };
      }
      
      setProfile(profile);
      form.setFieldsValue(profile);
    } catch (error) {
      console.error('Error loading profile:', error);
      message.error('Failed to load profile');
    }
  };

  const handleSave = async (values: any) => {
    if (!userId) return;

    setSaving(true);
    try {
      const updatedProfile = {
        ...profile,
        ...values
      };
      
      // Prepare data for Supabase (map registrationNumber to registration_number)
      const supabaseData = {
        id: userId,
        name: updatedProfile.name,
        specialization: updatedProfile.specialization,
        experience: updatedProfile.experience,
        phone: updatedProfile.phone,
        clinic: updatedProfile.clinic,
        qualifications: updatedProfile.qualifications,
        address: updatedProfile.address,
        registration_number: updatedProfile.registrationNumber,
        about: updatedProfile.about,
        avatar: updatedProfile.avatar
      };

      // Upsert to Supabase profiles table
      const { error } = await supabase
        .from('profiles')
        .upsert(supabaseData, {
          onConflict: 'id'
        });

      if (error) {
        throw error;
      }
      
      setProfile(updatedProfile);
      message.success("Profile updated successfully");
      setEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      message.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = () => {
    setEditing(true);
    form.setFieldsValue(profile);
  };

  const handleCancel = () => {
    setEditing(false);
    form.setFieldsValue(profile);
  };

  return (
    <SimpleLayout>
      <PageLoader loading={loading}>
        <div style={{ 
          padding: 24,
          backgroundColor: '#f5f5f5',
          minHeight: 'calc(100vh - 56px)'
        }}>
          <Title level={2} style={{ color: "#6C63FF", marginBottom: 24 }}>
            Doctor Profile
          </Title>
          
          <Row gutter={[24, 24]}>
            {/* Profile Summary Card */}
            <Col xs={24} lg={8}>
              <Card 
                style={{ 
                  borderRadius: 16,
                  background: 'linear-gradient(135deg, #6C63FF 0%, #5A52E8 100%)',
                  border: 'none',
                  color: 'white',
                  textAlign: 'center'
                }}
                bodyStyle={{ padding: '32px 24px' }}
              >
                <Avatar 
                  size={100} 
                  icon={<UserOutlined />} 
                  style={{ 
                    backgroundColor: 'rgba(255,255,255,0.2)', 
                    marginBottom: 16,
                    border: '4px solid rgba(255,255,255,0.3)'
                  }}
                />
                <Title level={3} style={{ color: 'white', margin: 0, marginBottom: 8 }}>
                  {profile.name || 'Doctor Name'}
                </Title>
                <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 14 }}>
                  {profile.email}
                </Text>
                <br />
                <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 16, fontWeight: 500 }}>
                  {profile.specialization}
                </Text>
                <br />
                <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>
                  {profile.experience}
                </Text>
                {profile.clinic && (
                  <>
                    <br />
                    <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>
                      🏥 {profile.clinic}
                    </Text>
                  </>
                )}
                {profile.phone && (
                  <>
                    <br />
                    <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>
                      📞 {profile.phone}
                    </Text>
                  </>
                )}
                
                <div style={{ marginTop: 24 }}>
                  {!editing ? (
                    <Button 
                      type="default" 
                      icon={<EditOutlined />}
                      onClick={handleEdit}
                      style={{ 
                        backgroundColor: 'white',
                        color: '#6C63FF',
                        border: 'none',
                        borderRadius: 8,
                        fontWeight: 500
                      }}
                    >
                      Edit Profile
                    </Button>
                  ) : (
                    <Space>
                      <Button 
                        onClick={handleCancel}
                        style={{ 
                          backgroundColor: 'rgba(255,255,255,0.1)',
                          color: 'white',
                          border: '1px solid rgba(255,255,255,0.3)',
                          borderRadius: 8
                        }}
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="primary" 
                        icon={<SaveOutlined />}
                        onClick={() => form.submit()}
                        loading={saving}
                        style={{ 
                          backgroundColor: 'white',
                          color: '#6C63FF',
                          border: 'none',
                          borderRadius: 8,
                          fontWeight: 500
                        }}
                      >
                        Save Changes
                      </Button>
                    </Space>
                  )}
                </div>
              </Card>
            </Col>

            {/* Profile Details Form */}
            <Col xs={24} lg={16}>
              <Card 
                title="Profile Information"
                style={{ borderRadius: 16 }}
                headStyle={{ backgroundColor: '#f8f9fa', borderRadius: '16px 16px 0 0' }}
              >
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={handleSave}
                  disabled={!editing}
                >
                  <Divider orientation="left">Personal Information</Divider>
                  <Row gutter={[16, 16]}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="name"
                        label="Full Name"
                        rules={[{ required: true, message: 'Please enter your name' }]}
                      >
                        <Input placeholder="Dr. John Smith" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="specialization"
                        label="Specialization"
                        rules={[{ required: true, message: 'Please enter your specialization' }]}
                      >
                        <Input placeholder="Physiotherapist" />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={[16, 16]}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="phone"
                        label="Phone Number"
                      >
                        <Input placeholder="+91 9876543210" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="registrationNumber"
                        label="Registration Number"
                      >
                        <Input placeholder="Medical Registration No." />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Divider orientation="left">Professional Information</Divider>
                  <Row gutter={[16, 16]}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="clinic"
                        label="Clinic/Hospital Name"
                      >
                        <Input placeholder="ABC Physiotherapy Clinic" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="experience"
                        label="Experience/Title"
                      >
                        <Input placeholder="5+ Years Experience" />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={[16, 16]}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="qualifications"
                        label="Qualifications"
                      >
                        <Input placeholder="BPT, MPT, PhD" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="address"
                        label="Clinic Address"
                      >
                        <Input placeholder="Clinic Address" />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Divider orientation="left">About</Divider>
                  <Form.Item
                    name="about"
                    label="About Yourself"
                  >
                    <Input.TextArea 
                      rows={4} 
                      placeholder="Tell patients about yourself, your expertise, and approach to treatment..."
                    />
                  </Form.Item>
                </Form>
              </Card>
            </Col>
          </Row>
        </div>
      </PageLoader>
    </SimpleLayout>
  );
}
