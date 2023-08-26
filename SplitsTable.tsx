import { useState, useEffect, useContext, useMemo } from "react";
import { SplitContext, OrientCourse, Runner } from "../../App"
import { useTable, Column } from "react-table"
import { getColor } from "../../Utils/getColor"
import "./SplitsTable.css"


interface Props {
    orientCourse: OrientCourse;
}

function calculateTimeDifference(firstTime: string, secondTime: string): string {
    const timePattern = /^\d{1,3}:\d{2}$/;
    
    if(!timePattern.test(secondTime) || !timePattern.test(firstTime)){
        return " ";
    }
    
    // Parse the time strings into seconds (assuming HH:MM format)
    const [firstMinutes, firstSeconds] = firstTime.split(":").map(Number);
    const [secondMinutes, secondSeconds] = secondTime.split(":").map(Number);
  
    // Calculate the time difference in seconds
    const firstTotalSeconds = firstMinutes * 60 + firstSeconds;
    const secondTotalSeconds = secondMinutes * 60 + secondSeconds;
    const differenceSeconds = secondTotalSeconds - firstTotalSeconds;
  
    // Convert the difference back to HH:MM format
    const differenceMinutes = Math.floor(differenceSeconds / 60);
    const remainingSeconds = differenceSeconds % 60;
    const formattedDifference = `+${String(differenceMinutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  
    return formattedDifference;
  }

export const SplitsTable = ({ orientCourse }: Props) => {
    const splitData = useContext(SplitContext);
    const splitColumns: Column<Runner>[] = splitData.controls[orientCourse.key].map((control: string, index: number) => ({
        Header: control,
        accessor: (row) => {
            if (row.splits && Array.isArray(row.splits) && row.splits[index]) {
                return row.splits[index][0];
            }
            return '';
        },
        
        Cell: ({ cell: { value }, row }: any) => {
            if (typeof value === 'string') {
                const originalData = row.original as Runner; // Cast to Runner type
                const tuple = originalData.splits[index];

                let lines = value.split('*');
                let linesHTML = lines.map((line: string, index: number) => {
                    if (tuple) {
                        const isBoldLine1 = index === 0 && typeof tuple[1] === 'number' && tuple[1] === 1;
                        const isBoldLine2 = index === 1 && typeof tuple[2] === 'number' && tuple[2] === 1;
                        const isBlue1 = index === 0 && typeof tuple[1] === 'number' && (tuple[1] === 1 || tuple[1] === 2 || tuple[1] === 3);
                        const isBlue2 = index === 1 && typeof tuple[2] === 'number' && (tuple[2] === 1 || tuple[2] === 2 || tuple[2] === 3);

                        return (
                            <div key={index} 
                                style={{ 
                                    fontWeight: (isBoldLine1 || isBoldLine2) ? 'bold' : 'normal',
                                    textDecoration: (isBoldLine1 || isBoldLine2) ? 'underline' : 'none',
                                    color:  (isBlue1 || isBlue2) ? 'blue' : 'black',
                                    backgroundColor: index === 0 ? getColor(tuple[3]) : getColor(tuple[4]),
                                    padding: '4px', // Add padding to the div inside the cell
                                    fontSize: '12px', // Adjust font size here
                                }}>
                                {line}
                            </div>
                        )
                    }
                });

                return <div
                    >
                    {linesHTML}</div>;

            } else {
                return null;
            }
          },
    }));

    const columns = useMemo(() => [
        {   
            Header: splitData.title + " " + splitData.courses[orientCourse.key],
            columns: [
                { Header: 'Place', accessor: 'place'},
                { Header: 'Name', accessor: 'name'},
                { Header: 'Result', accessor: 'overall_time'},
                { 
                    Header: 'Behind', 
                    accessor: (row) => {
                        const firstRunnerResult = splitData.runners[orientCourse.key][0].overall_time;
                        const currentRunnerResult = row.overall_time;
                        const difference = calculateTimeDifference(
                            firstRunnerResult,
                            currentRunnerResult
                        );
                        return difference;

                    }
                },
                ...splitColumns,
            ]
        }
    ], [orientCourse, splitData])

    const data = useMemo(() => splitData.runners[orientCourse.key], [orientCourse, splitData])

    const tableInstance = useTable({
        columns: columns,
        data: data
    })

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow
    } = tableInstance

    return (
        <table {...getTableProps()} className="bordered-table" style={{ fontFamily: 'Open Sans', fontWeight: 300, fontSize: '12px', }}>
            <thead>
                {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>{
                            headerGroup.headers.map(column => (
                                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
                            ))}
                    </tr>
                ))}
                
            </thead>
            <tbody {...getTableBodyProps()}>{
                rows.map(row => {
                    prepareRow(row)
                    const maxColumns = Math.max(headerGroups[0].headers.length, row.cells.length);
                    return (
                        <tr {...row.getRowProps()}>
                            {Array.from({ length: maxColumns }).map((_, colIndex) => {
                                const cell = row.cells[colIndex];

                                return (
                                    <td 
                                        {...cell.getCellProps()} 
                                    >   
                                        {colIndex < row.cells.length ? cell.render('Cell') : null}
                                    </td>
                                );
                            })}
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}