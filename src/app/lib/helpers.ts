'use client'
import { useRouter } from 'next/router';

export default function ActivePathCheck(link:string) {
  const router = useRouter();
  const { asPath } = router;

  const isHomePath = asPath.startsWith(link);

  return { isHomePath };
}