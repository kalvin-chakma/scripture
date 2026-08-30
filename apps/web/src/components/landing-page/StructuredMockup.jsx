import {
  HiOutlineHashtag,
  HiOutlineBars3BottomLeft,
  HiOutlineChatBubbleBottomCenterText,
  HiOutlineListBullet,
  HiOutlinePlus,
} from "react-icons/hi2";
import { RiDraggable } from "react-icons/ri";
import MockupWindow from "./MockupWindow";

export default function StructuredMockup() {
  const blocks = [
    {
      icon: HiOutlineHashtag,
      content: <p className="font-bold text-sm">Project Roadmap</p>,
      active: false,
    },
    {
      icon: HiOutlineBars3BottomLeft,
      content: (
        <p className="text-gray-600 dark:text-gray-300">
          Drop in any block and rearrange it freely.
        </p>
      ),
      active: false,
    },
    {
      icon: HiOutlineChatBubbleBottomCenterText,
      content: (
        <p className="italic text-emerald-700 dark:text-emerald-300">
          Ship the beta by Friday.
        </p>
      ),
      active: true,
    },
    {
      icon: HiOutlineListBullet,
      content: (
        <p className="text-gray-600 dark:text-gray-300">
          Gather feedback from testers
        </p>
      ),
      active: false,
    },
  ];

  return (
    <MockupWindow>
      <div className="p-4 space-y-1 text-xs">
        {blocks.map((block, i) => {
          const Icon = block.icon;
          return (
            <div
              key={i}
              className={`flex items-center gap-2 rounded-md px-2 py-2 ${
                block.active ? "bg-emerald-500/10" : ""
              }`}
            >
              <span className="w-3.5 h-3.5 shrink-0">
                {i === 0 && (
                  <HiOutlinePlus className="w-3.5 h-3.5 text-gray-400" />
                )}
              </span>
              <RiDraggable className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <Icon className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              {block.content}
            </div>
          );
        })}
      </div>
    </MockupWindow>
  );
}
