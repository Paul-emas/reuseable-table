import { Fragment, ReactNode } from "react";
import { cn, splitStringByUnderscore } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type StringKeys<T> = Extract<keyof T, string>;

export interface CustomDynamicTableProps<T> {
  tableData: T[];
  tableColumns: StringKeys<T>[];
  excludeColumns?: StringKeys<T>[];
  stickyHeaders?: boolean;
  selectedItems?: T[];
  className?: string;
  rowClassName?: string;
  customHeadRender?: (col: StringKeys<T>) => ReactNode | null | undefined;
  customBodyRender?: (
    rowData: T,
    col: StringKeys<T>
  ) => ReactNode | null | undefined;
  onRowClick?: (rowData: T) => void;
}

const CustomDynamicTable = <T extends object>(
  props: CustomDynamicTableProps<T>
) => {
  const {
    tableColumns,
    tableData,
    stickyHeaders = true,
    excludeColumns = [],
    className,
    rowClassName = "",
    selectedItems = [],
    customHeadRender,
    customBodyRender,
    onRowClick,
  } = props;

  function shouldRender(key: Extract<keyof T, string>) {
    if (excludeColumns.includes(key)) return false;
    return true;
  }

  function isSelected(rowData: T) {
    return selectedItems.some((item) => item === rowData);
  }

  return (
    <div className={cn("relative w-full overflow-auto", className)}>
      <Table>
        <TableHeader>
          <TableRow className="bg-muted">
            {tableColumns.map((col) => {
              const whatToRender = () => {
                if (!shouldRender(col)) return null;
                const renderedContent = customHeadRender
                  ? customHeadRender(col)
                  : null;
                return renderedContent || splitStringByUnderscore(col);
              };

              return (
                <Fragment key={col}>
                  {shouldRender(col) ? (
                    <TableHead
                      className={cn(
                        "whitespace-nowrap first-letter:capitalize",
                        stickyHeaders && "sticky top-0 z-10 bg-muted"
                      )}
                    >
                      {whatToRender()}
                    </TableHead>
                  ) : null}
                </Fragment>
              );
            })}
          </TableRow>
        </TableHeader>
        <TableBody>
          {tableData.map((row, idx) => {
            return (
              <TableRow
                key={idx}
                className={cn(
                  rowClassName,
                  isSelected(row) ? "bg-slate-200 hover:bg-slate-200" : ""
                )}
                onClick={() => (onRowClick ? onRowClick(row) : {})}
              >
                {tableColumns.map((col) => {
                  const whatToRender = () => {
                    if (!shouldRender(col)) return null;
                    const renderedContent = customBodyRender
                      ? customBodyRender(row, col)
                      : null;
                    return renderedContent || (row[col] as ReactNode);
                  };

                  return (
                    <Fragment key={col}>
                      {shouldRender(col) ? (
                        <TableCell className="whitespace-nowrap">
                          {whatToRender()}
                        </TableCell>
                      ) : null}
                    </Fragment>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default CustomDynamicTable;
