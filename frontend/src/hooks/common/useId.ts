"use client";

import { useParams, useSearchParams } from "next/navigation";

export const useQPId = () => {
  const searchParams = useSearchParams();
  return (searchParams.get("id") ?? '') as string;
};

export const usePId = () => {
  const { id } = useParams()
  if (!id) {
    throw new Error('ID is required');
  }
  return id as string;
}