import LoadingSpinner from "@/components/common/spinner";

export default function Loading() {
  return (
    <div className="py-8 md:py-16 w-full h-full flex justify-center items-center">
      <LoadingSpinner />
    </div>
  );
}
