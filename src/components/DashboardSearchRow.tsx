import { getUserInitials } from "@/lib/utils";
import React from "react";
import {
  MdModeEditOutline,
  MdOutlineDeleteOutline,
  MdOutlineRemoveRedEye,
} from "react-icons/md";
function DashboardSearchRow(props: DashboardSearchRowProps) {
  const createBadge = () => {
    if (props.category.toLowerCase() == "conversion") {
      if (props.status == "Initiated") {
        return (
          <span className="bg-yellow-100 text-yellow-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300">
            {props.status}
          </span>
        );
      } else {
        return (
          <span className="bg-green-100 text-green-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
            {props.status}
          </span>
        );
      }
    }
  };
  return (
    <tr id={props.id}>
      <td className="p-3 text-center">
        <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
          <span className="font-medium text-gray-600 dark:text-gray-300">
            {getUserInitials(props.fullName)}
          </span>
        </div>
        <span className="mx-2">{props.fullName}</span>
      </td>
      <td className="p-3 text-sm font-medium text-gray-900 truncate text-center">
        {props.category}
      </td>
      <td className="p-3 text-sm font-medium text-gray-900 truncate text-center">
        {props.applicationId}
      </td>
      <td className="p-3 text-center">{createBadge()}</td>
      <td className="p-3 ">
        <div className="flex justify-center">
          <div
            className="text-gray-400 hover:text-gray-200 mr-2"
            onClick={(e) =>
              props.actionCallback(props.id, props.category, "view")
            }
          >
            <MdOutlineRemoveRedEye size={25} />
          </div>
          {props.status == "Initiated" ? (
            <div
              className="text-gray-400 hover:text-gray-200 mx-2"
              onClick={(e) =>
                props.actionCallback(props.id, props.category, "edit")
              }
            >
              <MdModeEditOutline size={25} />
            </div>
          ) : null}
          <div
            className="text-gray-400 hover:text-gray-200 ml-2"
            onClick={(e) =>
              props.actionCallback(props.id, props.category, "delete")
            }
          >
            <MdOutlineDeleteOutline size={25} />
          </div>
        </div>
      </td>
    </tr>
  );
}

export default DashboardSearchRow;

export interface DashboardSearchRowProps {
  id: string;
  fullName: string;
  applicationId: string;
  category: string;
  status: string;
  actionCallback: (id: string, type: string, action: string) => void;
}
