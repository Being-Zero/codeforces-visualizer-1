import React, { useState } from "react";
import './yourComp.css'
import { Chart } from "react-google-charts";

// import json÷



const Input = () => {
  const [input1, setInput1] = useState("");
  const [input2, setInput2] = useState("");
  // const [jsonData, setJsonData] = useState(null);
  const [dataMap, setDataMap] = React.useState([]);
  const [showTable, setShowTable] = useState(false);
  const [showPie, setShowPie] = useState(false);
  const [ready, setReady] = useState(false);
  const [note, setNote] = useState(true);

  const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === "input1") {
            setInput1(value);
        } else if (name === "input2") {
            setInput2(value);
        }


    };

    const visitLink = async () => {
        const link=`https://c2-ladders.com/api/ladder?startRating=${encodeURIComponent(input1)}&endRating=${encodeURIComponent(input2)}`;
        const tagCountMap=new Map();
        try {
            const response = await fetch(link);
            const data = await response.json();
            // setJsonData(data);
            
                    // const jsonObject = JSON.parse(data);
                    let str="https://codeforces.com/problemset/problem/";
                    data.data.forEach((ladder) => {
                      let str2=str+""+ladder.contestId+"/"+ladder.index;
                      ladder.tags.forEach((tag) => {
                        tag=tag.toLowerCase();
                        if(tagCountMap.has(tag))
                        {
                          tagCountMap.get(tag).push(str2)
                        } 
                        else{
                          tagCountMap.set(tag,[str2])
                        }
                      });
                    });
                    setDataMap(tagCountMap);
                    // setDataMap(tagCountMap)
                    console.log(dataMap)
        } catch (error) {
            console.error("Error fetching JSON data:", error);
            // setJsonData(null);
        }
        //temp map for storing data
        setReady(true);

    };


    const [expandedTag, setExpandedTag] = useState(null);

    const handleTagClick = (tag) => {
      setExpandedTag((prevTag) => (prevTag === tag ? null : tag));
    };

    const handleButtonClick = () => {
      setShowPie(false)
      setNote(false);
      setShowTable((prevShowTable) => !prevShowTable);
    };

    const handlePieClick=()=>{
      setShowTable(false)
      setNote(false);

      setShowPie((showPie)=>!showPie)
    }
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
    
    const downloadCSV = () => {
      const csvContent = Array.from(dataMap.entries())
        .map(([tag, strings]) => strings.map((str) => `${tag},${str}`))
        .flat()
        .join('\n');
    
      const csvHeader = 'Tag,problems\n';
      const csvCompleteContent = csvHeader + csvContent.replace(/\n(?!\n)/g, '\n');
    
      const blob = new Blob([csvCompleteContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'data_map.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    };
    
    // const sectionNames = dataMap.map(([key, _]) => key);


    


    return (
        <div className="container mt-5">
            <h1 className="mb-4">Codeforces Ratings  </h1>
            <div className="row">
                <div className="col-md-6">
                    <div className="mb-3">
                        <label htmlFor="input1" className="form-label">
                          Start Range:
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="input1"
                            name="input1"
                            value={input1}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="mb-3">
                        <label htmlFor="input2" className="form-label">
                            End Range:
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="input2"
                            name="input2"
                            value={input2}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
            </div>
            <div className="holas">
                <button className="btn btn-primary" onClick={visitLink}>
                    Generate
                </button>
                {ready && (
                  <>
                    <button className="btn btn-primary mx-3" onClick={handleButtonClick}>
                      {showTable ? 'Hide Table' : 'Show Table'}
                    </button>
                    <button className="btn btn-primary" onClick={handlePieClick}>{showPie ? 'Hide Pie Chart' : 'Show Pie Chart'}</button>
                    <button className="btn btn-primary mx-3" id="dns" onClick={downloadCSV}>Download CSV</button>
                  </>
                )}  
                {(note && 
                <>
            <div className="alert alert-primary my-1">
              <strong>Note:</strong> Input should be with in the range 800 to 3500 difference <b> not more than 120.</b>
            </div>
            {/* <div className="alert alert-primary my-1">
              If inputs are multiples of 100 users get accurate results. <b>example 800,900,1000, . . . , 3500</b> 
            </div> */}
            
                </>
                )}
            {(showTable && 
                      <div className="alert alert-primary my-1">
                      <strong>Note:</strong> Click on Tags to get questions List only for those tags.
                    </div>
            )}
            {( !note && 
            <div className="alert alert-primary my-1">
              <strong>Note:</strong> Click on <b>Download CSV</b> to get csv file of problems based on category in the given range.
            </div>
            )}
            
            </div>
            <div className="table-container">
              {showTable && (<h2>Tag Wise categorization</h2>)}
      
      {showTable && (
        <table className="data-table">
          <thead>
            <tr>
              <th>Tag</th>
              <th>Values</th>
            </tr>
          </thead>
          <tbody>
            {Array.from(dataMap.entries()).map(([tag, strings]) => (
              <React.Fragment key={tag}>
                <tr>
                  <td
                    onClick={() => handleTagClick(tag)}
                    className={expandedTag === tag ? 'clickable-tag' : ''}
                    id="points"
                  >
                    {tag + " (" + dataMap.get(tag).length +")"}
                  </td>
                  <td className="fixed-values-column">
                    {expandedTag === tag && (
                      <ul>
                        {strings.map((str, index) => (
                          <li  key={index}>{str}</li>
                        ))}
                      </ul>
                    )}
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      )}
    </div>
    {showPie && (
    <Chart
      chartType="PieChart"
      data={data}
      options={options}
      width={"100%"}
      height={"400px"}
    />
    )}
        </div>
    );
};

export default Input;