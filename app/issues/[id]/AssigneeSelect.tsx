"use client";

import { Issue, User } from "@/app/generated/prisma";
import { Select } from "@radix-ui/themes";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Skeleton } from "@/app/components";

const AssigneeSelect = ({ issue }: { issue: Issue }) => {
  const {
    data: users,
    error,
    isLoading,
  } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await axios.get("/api/users");
      return response.data;
    },
    staleTime: 60 * 1000,
    retry: 3,
  });

  if (isLoading) return <Skeleton />;

  if (error) return null;

  const currentValue = issue.assignedToUserId ?? "null";

  return (
    <Select.Root
      defaultValue={currentValue}
      onValueChange={(value) => {
        const assignedToUserId = value === "null" ? null : value;
        axios.patch(`/api/issues/${issue.id}`, { assignedToUserId });
      }}
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
  );
};

export default AssigneeSelect;
