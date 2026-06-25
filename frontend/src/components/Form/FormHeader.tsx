import { ArrowLeft, FilePlus } from "lucide-react";
import { Link } from "react-router-dom";

type FormHeaderProps = {
  title: string;
  subTitle: string;
  link: string;
  description?: string;
  pacientName?: { name: string };
};

export const FormHeader = ({
  title,
  subTitle,
  link,
  description,
  pacientName,
}: FormHeaderProps) => {
  return (
    <div className="flex items-start justify-between min-w-0">
      <div className="flex min-w-0 flex-col gap-1">
        <div className="flex items-center gap-2 flex-wrap">
          <Link
            to={link}
            className="flex items-center gap-1 px-1.5 py-1 rounded text-[#64748B] text-sm hover:bg-[#F1F5F9] transition-colors"
          >
            <ArrowLeft size={15} />
            {title}
          </Link>
          <span className="text-[#CBD5E1] text-sm">/</span>
          <FilePlus size={20} className="text-[#38A169]" />
          <h1 className="text-xl sm:text-[22px] font-semibold text-[#1E293B] dark:text-[#64748B] break-words">
            {subTitle}
          </h1>
        </div>
        {description && (
          <p className="text-[13px] text-[#94A3B8]">{description}</p>
        )}
        {pacientName && (
          <p className="text-[13px] text-[#94A3B8]">
            Prontuário de{" "}
            <span className="font-medium text-[#64748B]">
              {pacientName.name}
            </span>
          </p>
        )}
      </div>
    </div>
  );
};
