import TaskDetail from "@/features/dashboard/task-detail";

interface TaskPageProps {
  params: {
    id: string;
  };
}

export default function TaskPage({ params }: TaskPageProps) {
  return <TaskDetail id={params.id} />;
}
