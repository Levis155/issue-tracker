"use client";

import { Skeleton } from "@/app/components";
import { Issue, User } from "@/app/generated/prisma";
import { Select } from "@radix-ui/themes";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const AssigneeSelect = ({ issue }: { issue: Issue }) => {
  const { data: users, error, isLoading } = useUsers();

  if (isLoading) return <Skeleton />;

  if (error) return null;

  const currentValue = issue.assignedToUserId ?? "null";

  const handleOnValueChange = async (value: string) => {
    try {
      const assignedToUserId = value === "null" ? null : value;
      await axios.patch(`/api/issues/${issue.id}`, { assignedToUserId });
    } catch (error) {
      toast.error("Changes could not be saved.");
    }
  };

  return (
    <>
      <Select.Root
        defaultValue={currentValue}
        onValueChange={handleOnValueChange}
      >
        <Select.Trigger placeholder="Assign..." />
        <Select.Content>
          <Select.Group>
            <Select.Label>Suggestions</Select.Label>
            <Select.Item value="null">Unassigned</Select.Item>
            {users?.map((user) => (
              <Select.Item key={user.id} value={user.id}>
                {user.name}
              </Select.Item>
            ))}
          </Select.Group>
        </Select.Content>
      </Select.Root>

      <Toaster />
    </>
  );
};

const useUsers = () =>
  useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await axios.get("/api/users");
      return response.data;
    },
    staleTime: 60 * 1000,
    retry: 3,
  });

export default AssigneeSelect;
