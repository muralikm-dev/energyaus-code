import React from 'react';
//import Records from './data/records2.json';

class App extends React.Component {

  constructor(props){
    super(props);
    this.recLabelIndexed = {};
    this.recLabelList = [];
    this.bandNameIndexed = {};
    this.bandNameRecList = [];
    this.state = {
      items : [],
      errorFound: false
    }

    this.uploadBandRecLabel = this.uploadBandRecLabel.bind(this);
    this.groupByRecLabel = this.groupByRecLabel.bind(this);

  }

  componentDidCatch(error, errorInfo) {
    this.setState({items : [],errorFound:true});
    console.log(error);
    console.log(errorInfo);
  }

  componentDidMount(){

    const url = "http://eacodingtest.digital.energyaustralia.com.au/api/v1/festivals";
    const response = fetch(url, {
      method: 'GET',
      dataType: 'json',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(json => {
    //console.log(json);

    this.setState({items:json});

    })

//Cross-Origin Request Blocked:
// The Same Origin Policy disallows reading the remote resource at http://eacodingtest.digital.energyaustralia.com.au/api/v1/festivals.
// (Reason: CORS header ‘Access-Control-Allow-Origin’ missing).
//Due to above reason the URL is not working so copied the data and put in the json file and rendering

    //this.setState({items:Records});

  }

  uploadBandRecLabel = () => {
    const items = this.state.items;
    if(items.length === 0){
      return (<div><p>No Items Found</p></div>)
    }
    items.map((recordDet,index) => {
      this.bandNameRecList.push(recordDet.bands);

      return (
          <div key={index}>
            {this.bandNameRecList};
          </div>)
    })
  }

  groupByRecLabel = () => {

    const items = this.state.items;
    if(items.length === 0){
      return (<div><p>No Items Found</p></div>)
    }
    items.map((recordDet,index) => {

      return <div key={index}>

        {recordDet.bands.map((innerDet, index2) => {


          //GroupBy RecordLabel
          if (!this.recLabelIndexed[innerDet.recordLabel]) {
            this.recLabelIndexed[innerDet.recordLabel] = {
              recLabel: innerDet.recordLabel,
              rlBands: []
            };
            this.recLabelList.push(this.recLabelIndexed[innerDet.recordLabel]);
          }

          //GroupByBandName
          //console.log(this.recLabelIndexed);
          if (!this.bandNameIndexed[innerDet.name]) {
            this.bandNameIndexed[innerDet.name] = {
              bName: innerDet.name,
              musFestList: []
            };
            //this.bandNameList.push(this.bandNameIndexed[innerDet.name]);
          }

          if (innerDet.recordLabel === "" || innerDet.recordLabel === undefined) {
            //const records = this.findUndefinedRecLabel(this.bandNameRecList,innerDet.name);
            //console.log(records);
            //innerDet.recordLabel = records.recordLabel;
          }

          this.bandNameIndexed[innerDet.name].musFestList.push({mName: recordDet.name});

          this.recLabelIndexed[innerDet.recordLabel].rlBands.push(this.bandNameIndexed[innerDet.name]);

          //Sorting
          this.bandNameIndexed[innerDet.name].musFestList.sort((a,b) => (a.mName > b.mName) ? 1: -1);
          this.recLabelIndexed[innerDet.recordLabel].rlBands.sort((a,b) => (a.bName > b.bName) ? 1: -1);
          this.recLabelList.sort((a, b) => (a.recLabel > b.recLabel) ? 1 : -1);



          //console.log(this.recLabelList);

          return (
              <div key={index2}>
                {this.recLabelList};
              </div>)
        })}

      </div>

    })

  }

   findUndefinedRecLabel = (myList,name) => {

    const unknownRecord = myList.map((recordDet,index) => {
      const returnedValue = recordDet.find(function(indexList,index2){
      if(indexList.name.toLowerCase() === name.toLowerCase()){
        if(indexList.recordLabel !== "" || indexList.recordLabel !== undefined){
          //console.log(indexList.recordLabel);
          return indexList.recordLabel;
        }
      }

    })
      //console.log(recordDet[returnIndex]);
      return returnedValue;
    })
    //console.log(unknownRecord);
     return ;
  }


  render(){

    if(this.state.errorFound){
      return <p>Error Found on page</p>
    }

    this.uploadBandRecLabel();
    this.groupByRecLabel();

    //console.log(this.bandNameRecList);

    return (
      <div>
        
        {this.recLabelList.map((recordDet,index) => {
          return (
            <div key={index}>
              <ul>{recordDet.recLabel}
            
          {recordDet.rlBands.map((bandDet,index2) => {
            return (<div key={index2}>

                <li>{bandDet.bName}</li>
                  {bandDet.musFestList.map((musFest,index3) => {
                    return (
                        <div key={index3}>
                        <ul><li>{musFest.mName}</li></ul>
                        </div>
                    )
                  })}


              </div>)
          })}
              </ul>
          </div>
          )
        })}
      </div>
    );
  }
}

export default App;
