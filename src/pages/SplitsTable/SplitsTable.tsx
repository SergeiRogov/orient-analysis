import { useContext, useState, useMemo, useEffect, useRef } from "react";
import { SplitContext, OrientCourse, Runner } from "../../App"

import { useTable, Column } from "react-table"
import { getColor } from "../../Utils/getColor"
import "./SplitsTable.css"

interface Props {
    orientCourse: OrientCourse;
    isLoading: boolean;
}

function calculateTimeDifference(firstTime: string, secondTime: string): string {
    const timePattern = /^\d{1,3}:\d{2}$/;
    
    if(!timePattern.test(secondTime) || !timePattern.test(firstTime)){
        return " ";
    }
    
    // Parse the time strings into seconds (assuming MM:SS format)
    const [firstMinutes, firstSeconds] = firstTime.split(":").map(Number);
    const [secondMinutes, secondSeconds] = secondTime.split(":").map(Number);
  
    // Calculate the time difference in seconds
    const firstTotalSeconds = firstMinutes * 60 + firstSeconds;
    const secondTotalSeconds = secondMinutes * 60 + secondSeconds;
    const differenceSeconds = secondTotalSeconds - firstTotalSeconds;
    
    // Convert the difference back to HH:MM format
    const differenceMinutes = Math.floor(Math.abs(differenceSeconds) / 60);
    const remainingSeconds = Math.abs(differenceSeconds % 60);

    const sign = differenceSeconds < 0 ? '-' : '+';
    const formattedDifference = `${sign}${String(differenceMinutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;

    return formattedDifference;
}

export const SplitsTable = ({ orientCourse, isLoading}: Props) => {

    const [maxHeight, setMaxHeight] = useState<number | null>(null);

    useEffect(() => {
        // This effect will run when the component mounts
    
        // Hide popups when the component unmounts
        return () => {
          document.querySelectorAll<HTMLElement>('.popup').forEach(popup => {
            popup.style.display = 'none';
          });
        };
    }, []);

    if (isLoading) {
        // Hide existing popups when loading
        document.querySelectorAll<HTMLElement>('.popup').forEach(popup => {
            popup.style.visibility = 'hidden';
            popup.style.display = 'none';
        });
    } 

    const tableRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (tableRef.current) {
            const tableHeight = tableRef.current.clientHeight;
            const newMaxHeight = tableHeight + 100;
    
            // Set the state with the newMaxHeight
            setMaxHeight(newMaxHeight);
        }
    }, []);

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

                // Define event handlers for each line
                const handleLineHover = (lineIndex: number, event: MouseEvent | null) => {

                    if (!event || !(event.target instanceof HTMLElement)) {
                        return; // Do nothing if event is null or target is not an HTML element
                    }

                    if (isLoading) {
                        // Hide existing popups when loading
                        document.querySelectorAll<HTMLElement>('.popup').forEach(popup => {
                            popup.style.visibility = 'hidden';
                            popup.style.display = 'none';
                        });
                        return;
                    } 

                    document.querySelectorAll<HTMLElement>('.popup').forEach(popup => {
                        popup.style.visibility = 'hidden';
                        popup.style.display = 'none';
                    });
    
                    const popup = document.createElement('div');
                    popup.className = 'popup';

                    popup.style.whiteSpace = 'pre-line';

                    const split = tuple[7];
                    const cumul = tuple[8];

                    const splitParts = split.split(' ');
                    const cumulParts = cumul.split(' ');

                    if (splitParts.length === 2 && cumulParts.length === 2) {
                        popup.textContent = lineIndex === 0 ? splitParts[0] + '\n' + splitParts[1] : cumulParts[0] + '\n' + cumulParts[1];
                    } else {
                        // Handle the case when the input string doesn't contain two parts
                        popup.textContent = lineIndex === 0 ? tuple[7] : tuple[8];
                    }
                    
                    // Add styles to the pop-up element
                    popup.style.position = 'absolute';
                    popup.style.backgroundColor = '#403434';
                    popup.style.color = 'white';
                    popup.style.padding = '5px';
                    popup.style.borderRadius = '5px';
                    popup.style.zIndex = '1000';

                    popup.style.fontFamily = 'Arial, sans-serif';
                    popup.style.fontSize = '14px';

                    // Calculate the position of the pop-up
                    const rect = event.target.getBoundingClientRect();
                    const popupHeight = 47;
                    popup.style.top = (rect.top - popupHeight) + window.scrollY + 'px';
                    popup.style.left = rect.left + window.scrollX + 'px';

                    // Append the pop-up to the body
                    document.body.appendChild(popup);

                    // Create a triangle element for the bottom
                    const triangle = document.createElement('div');
                    triangle.className = 'triangle';

                    // Add styles to the triangle element
                    triangle.style.position = 'absolute';
                    triangle.style.bottom = '-10px'; // Adjust the position as needed
                    triangle.style.left = '50%';
                    triangle.style.transform = 'translateX(-50%)';
                    triangle.style.width = '0';
                    triangle.style.height = '0';
                    triangle.style.borderLeft = '10px solid transparent';
                    triangle.style.borderRight = '10px solid transparent';
                    triangle.style.borderTop = '10px solid #403434'; // Color should match popup background

                    // Append the triangle to the popup
                    popup.appendChild(triangle);
            
                    // let hideTimeout: number | undefined;

                    // event.target?.addEventListener('mouseenter', () => {
                    //     if (hideTimeout) {
                    //         clearTimeout(hideTimeout);
                    //     }
                    //     popup.style.visibility = 'visible';
                    // });

                    // event.target?.addEventListener('mouseleave', () => {
                        
                    //     hideTimeout = setTimeout(() => {
                    //         popup.style.visibility = 'hidden';
                    //     }, 100) as any;
                    // });
                    let hideTimeout: number | undefined;

                    const showPopup = () => {
                        if (hideTimeout) {
                            clearTimeout(hideTimeout);
                        }
                        popup.style.visibility = 'visible';
                    };

                    const hidePopup = () => {
                        hideTimeout = setTimeout(() => {
                            if (document.body.contains(popup)) {
                                document.body.removeChild(popup);
                            }
                            popup.style.visibility = 'hidden';
                        }, 100) as any;
                    };

                    // Attach event listeners to manage popup visibility
                    popup.addEventListener('mouseenter', showPopup);
                    popup.addEventListener('mouseleave', hidePopup);

                    event.target?.addEventListener('mouseenter', showPopup);
                    event.target?.addEventListener('mouseleave', hidePopup);
                };

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
                                    padding: '5px', // Add padding to the div inside the cell
                                    fontSize: '12px', // Adjust font size here
                                    height: '100%',
                                }}
                                onMouseOver={(event: any) => handleLineHover(index, event)}
                            >
                                {line}
                            </div>
                        )
                    }
                });

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
        <div ref={tableRef} 
            className="table-container"  
            style={{ maxHeight: maxHeight ? `${maxHeight}px` : '1700px', 
            overflowY: 'auto' }} >
     
            <table {...getTableProps()} 
            className="table" 
            style={{ 
                fontFamily: 'Open Sans', 
                fontWeight: 300, 
                fontSize: '12px',
                backgroundColor: "#DBDEE6",
                }}>
                <thead>
                    {headerGroups.map((headerGroup) => (
                        <tr {...headerGroup.getHeaderGroupProps()}>{
                                headerGroup.headers.map((column, index) => (
                                    <th {...column.getHeaderProps()}> {column.render("Header")} </th>
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
                                        <td {...cell.getCellProps()}>   
                                            {colIndex < row.cells.length ? cell.render('Cell') : null}
                                        </td>
                                    );
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
