import { useState, useEffect, useContext, useMemo } from "react";
import { SplitContext, OrientCourse, Runner } from "../App"
import { useTable, Column } from "react-table"

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
        
        Cell: ({ cell: { value } }: any) => {
            if (typeof value === 'string') {
                let lines = value.split('*');
                let linesHTML = lines.map((line: string, index: number) => <div key={index}>{line}</div>);
                return <div>{linesHTML}</div>;
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
        // <div>
        //     <h4>{splitData?.title}</h4>
        //     <h4>{splitData?.courses[orientCourse.key]}</h4>
        //     <h6>{splitData?.controls[orientCourse.key]}</h6>
        //     {splitData?.runners[orientCourse.key]?.map((runner: Runner) => (
        //         <h6 key={runner.id}>{runner.place + " " + runner.name + " " + runner.overall_time + " " + runner.splits}</h6>
        //     ))}        
        // </div>
        
        <table {...getTableProps()}>
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
                    return (
                        <tr {...row.getRowProps()}>{
                            row.cells.map((cell) => {
                                return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                            })}
                        </tr>
                    )
                })}
            </tbody>
        </table>
    )
}