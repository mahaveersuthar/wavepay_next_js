import ApiDocumentation from "@/components/developer/api-document/ApiDocument";

export default function ApiDocsLayout() {
  return (
    <div>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
       <ApiDocumentation/>
        </div>
    </div>
  );
}
