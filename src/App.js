import React, {useEffect, useState } from 'react';
import './App.css';
import { Layout, Typography, Row, Col } from 'antd';
import {VictoryVoronoiContainer, VictoryChart, VictoryTheme, VictoryAxis, VictoryTooltip, VictoryLine } from 'victory';
import axios from 'axios';
const { Title, Paragraph, Text } = Typography;
const { Header, Content, Footer } = Layout;

const sampleData = [
  {date: new Date(Date.parse("2020-01-31")), cases: 1, label: 18},
  // {date: new Date(Date.parse("2020-02-02")), new_cases: 2, label: 18},
  // {date: new Date(Date.parse("2020-02-28")), new_cases: 3, label: 18},
  // {date: new Date(Date.parse("2020-02-29")), new_cases: 4, label: 18},
  // {date: new Date(Date.parse("2020-03-01")), new_cases: 7, label: 18},
  // {date: new Date(Date.parse("2020-03-02")), new_cases: 9, label: 18},
  // {date: new Date(Date.parse("2020-03-03")), new_cases: 11, label: 18},
  // {date: new Date(Date.parse("2020-03-04")), new_cases: 14, label: 18},
  // {date: new Date(Date.parse("2020-03-05")), new_cases: 20, label: 18},
  // {date: new Date(Date.parse("2020-03-06")), new_cases: 24, label: 18},
  // {date: new Date(Date.parse("2020-03-07")), new_cases: 32, label: 18},
  // {date: new Date(Date.parse("2020-03-08")), new_cases: 37, label: 18},
  // {date: new Date(Date.parse("2020-03-09")), new_cases: 43, label: 18},
  // {date: new Date(Date.parse("2020-03-10")), new_cases: 45, label: 18},
  // {date: new Date(Date.parse("2020-03-11")), new_cases: 48, label: 18},
  // {date: new Date(Date.parse("2020-03-12")), new_cases: 66, label: 18},
  // {date: new Date(Date.parse("2020-03-13")), new_cases: 79, label: 18},
  // {date: new Date(Date.parse("2020-03-14")), new_cases: 91, label: 18},
  // {date: new Date(Date.parse("2020-03-15")), new_cases: 114, label: 18},
  // {date: new Date(Date.parse("2020-03-16")), new_cases: 138, label: 18},
  // {date: new Date(Date.parse("2020-03-17")), new_cases: 155, label: 18},
  // {date: new Date(Date.parse("2020-03-18")), new_cases: 175, label: 18},
  // {date: new Date(Date.parse("2020-03-19")), new_cases: 189, label: 18},
];

Date.prototype.addDays = function(days) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
}

function getDates(startDate, stopDate) {
  var dateArray = new Array();
  var currentDate = startDate;
  while (currentDate <= stopDate) {
      dateArray.push(new Date (currentDate));
      currentDate = currentDate.addDays(5);
  }
  return dateArray;
}

function CenterContent(props){
  let date_range = getDates(new Date("January 31, 2020 00:00:00"), new Date());
  console.log(date_range);
  
  
  const [count, setCount] = useState(sampleData);

  useEffect(() => {
    console.log("hello");
    axios.get("/data/cases")
    .then((res) => {
      let r = []
      let list = res.data;
      for(let x = 0; x < list.length; x++){
        let insert_record = {
          date: new Date(Date.parse(list[x]["date"])),
          cases: list[x]["cases"],
          label: list[x]["cases"].toString()
        };

        console.log(insert_record);

        r.push(insert_record);
      }

      setCount(r)
    })
  }, []);

  return (
    <VictoryChart
      theme={VictoryTheme.material}
      containerComponent={
        <VictoryVoronoiContainer/>
      }
    >
      <VictoryLine
        style={{
          data: { stroke: "#c43a31" },
          parent: { border: "1px solid #ccc"}
        }}
        data={count}
        x="date"
        y="cases"
        labels={({ datum }) => datum.label}
        labelComponent={<VictoryTooltip/>}
        size={({ active }) => active ? 5 : 3}
        animate={{
          duration: 2000,
          onLoad: { duration: 1000 }
        }}
        // labelComponent={<VictoryTooltip/>}
      />
      <VictoryAxis
        tickValues={date_range}
        tickFormat={(t) => `${t.getMonth()+1}/${t.getDate()}`}
      />
    </VictoryChart>
  )
}

function App() {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="App-header">
      <Header>
        <Title>
          covid-19 @ scc
        </Title>
      </Header>
      <Content>
        <Row>
          <Col>
            <Header level={3}>
              Number of confirmed cases in Santa Clara County
            </Header>
            <CenterContent/>
          </Col>
        </Row>
      </Content>
    </div>
  );
}

export default App;
