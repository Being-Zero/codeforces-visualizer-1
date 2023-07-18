import React,{useState} from 'react';
import Papa from 'papaparse';
import './MapDisplay.css';
// import React from 'react';
// import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import { Chart } from "react-google-charts";
// import { PieChart } from 'react-minimal-pie-chart';



const abc = () => {
  return (
    <div  className='hola'>
      <h1>CSV File Uploader</h1>
      <FileUploader />
      {/* <PieChart/>
       */}
           {/* <Chart
      chartType="PieChart"
      data={data}
      options={options}
      width={"100%"}
      height={"400px"}
    /> */}
    </div>
  );
};
// let dataMap=new Map();
const FileUploader = () => {
  const [selectedFile, setSelectedFile] = React.useState(null);
  // const [columnNames, setColumnNames] = React.useState([]);
  const [dataMap, setDataMap] = React.useState([]);
  // const [count, setCount] = React.useState(0);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleFileUpload = () => {
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const fileData = event.target.result;
        localStorage.setItem('uploadedFile', fileData);
        parseCSVFile(fileData);
        createPie(fileData);
      };
      reader.readAsText(selectedFile);
    }
  };

  const parseCSVFile = (fileData) => {
    const parsedData = Papa.parse(fileData);
    // const firstRow = parsedData.data[0];
    console.log(parsedData)
    // setColumnNames(firstRow);
  };

  const createPie=(data)=>
  {
    const data2 = Papa.parse(data);
    let i=1
    console.log("first", )
    const map=new Map();
    while(data2.data[i]!==undefined)
    {
      let str=data2.data[i][2]+"";
      let arr=str.split(',')
      for(let j=0;j<arr.length;j++)
      {
        // setCount(count+1);
        arr[j]=arr[j].toLocaleLowerCase();
        if(map.has(arr[j]))
        {
          map.get(arr[j]).push(data2.data[i][1])
        }
        else{
          map.set(arr[j],[data2.data[i][1]])
        }
      }
      i++
    }

    // setCount(i-2)
    // dataMap=map;
    setDataMap(map);
    // <PieChart>
    //   <Pie data={map} color='green'></Pie>
    // </PieChart>
    console.log(dataMap)
  }
 
  const [selectedKey, setSelectedKey] = useState(null);

  const handleKeyClick = (key) => {
    setSelectedKey(key === selectedKey ? null : key);
  };
  const handleDownload = () => {
    const csvContent = convertToCSV(dataMap);
    const csvData = new Blob([csvContent], { type: 'text/csv' });
    const csvURL = window.URL.createObjectURL(csvData);
    const tempLink = document.createElement('a');
    tempLink.href = csvURL;
    tempLink.setAttribute('download', 'table.csv');
    document.body.appendChild(tempLink);
    tempLink.click();
    document.body.removeChild(tempLink);
  };



  //readXY followup me 
  const convertToCSV = (map) => {
    let csv = 'Category,Value\n';
    let isFirstValue = true;
    for (const [category, values] of map.entries()) {
      values.forEach((value, index) => {
        if (isFirstValue) {
          csv += `${category},"${value}"\n`;
          isFirstValue = false;
        } else {
          csv += `,"${value}"\n`;
        }
      });

      csv += '\n'; // Add empty row after each key
      isFirstValue = true;
    }
    return csv;
  };
  
  const data = [
    ["Tags", "Percentage"],

  ];
  // const mapss = new Map(Array.from(dataMap).sort((a, b) => b[1].length - a[1].length));

  for (const [key, value] of dataMap) {
    if(key!=="undefined")
    {
    //  let  key2=key.toLocaleUpperCase();
    let key2= key.charAt(0).toUpperCase() + key.slice(1);
      data.push([key2, value.length]);

    }
  }
  // let str="asdfg";
  // str=str.toLocaleLowerCase();

  const options = {
    title: "Pie Chart for tags based",
    // is3D: true, //for 3d uncomment
    pieHole: 0.4, //for donut chart uncomment
  };



  return (
    <div>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <button onClick={handleFileUpload}>Upload</button>
      {/* {columnNames.length > 0 && (
        <div>
          <h3>Column Names:</h3>
          <ul>
            {columnNames.map((columnName, index) => (
              <li key={index}>{columnName}</li>
            ))}
          </ul>
              {console.log(dataMap)}
        </div>
      )} */}
    <div className="map-display">
      <h2 className='heads'>Tags Wise Division </h2>
      <table className="data-table">
        <thead>
          <tr>
            <th>Tags</th>
            <th>Questions</th>
          </tr>
        </thead>
        <tbody>
          {Array.from(dataMap, ([Tags, values]) => (
            <tr key={Tags}>
              <td
                onClick={() => handleKeyClick(Tags)}
                className={selectedKey === Tags ? 'selected' : ''}
              >
                {Tags + " "+  "(" +dataMap.get(Tags).length + ")"}
              </td>
              <td>
                {selectedKey === Tags && (
                  <ul>
                    {values.map((value, index) => (
                      <li key={index}>{value}</li>
                    ))}
                  </ul>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
      <button onClick={handleDownload}>Download CSV</button>
      {/* <PieChart/> */}
                 <Chart
      chartType="PieChart"
      data={data}
      options={options}
      width={"100%"}
      height={"400px"}
    />
    </div>
  )
}
export default abc;