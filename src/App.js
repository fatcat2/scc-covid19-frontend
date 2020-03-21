import React, {useEffect, useState } from 'react';
import './App.css';
import { Layout, Typography, Row, Col, Statistic } from 'antd';
import {VictoryVoronoiContainer, VictoryChart, VictoryTheme, VictoryAxis, VictoryTooltip, VictoryLine } from 'victory';
import axios from 'axios';
import CountUp from "countup";

const { Title, Paragraph, Text } = Typography;
const { Header, Content, Footer } = Layout;


const sampleData = [
  {date: new Date(Date.parse("2020-01-31")), cases: 1, label: 18},
  {date: new Date(Date.parse("2020-02-02")), cases: 2, label: 18},
  {date: new Date(Date.parse("2020-02-28")), cases: 3, label: 18},
  {date: new Date(Date.parse("2020-02-29")), cases: 4, label: 18},
  {date: new Date(Date.parse("2020-03-01")), cases: 7, label: 18},
  {date: new Date(Date.parse("2020-03-02")), cases: 9, label: 18},
  {date: new Date(Date.parse("2020-03-03")), cases: 11, label: 18},
  {date: new Date(Date.parse("2020-03-04")), cases: 14, label: 18},
  {date: new Date(Date.parse("2020-03-05")), cases: 20, label: 18},
  {date: new Date(Date.parse("2020-03-06")), cases: 24, label: 18},
  {date: new Date(Date.parse("2020-03-07")), cases: 32, label: 18},
  {date: new Date(Date.parse("2020-03-08")), cases: 37, label: 18},
  {date: new Date(Date.parse("2020-03-09")), cases: 43, label: 18},
  {date: new Date(Date.parse("2020-03-10")), cases: 45, label: 18},
  {date: new Date(Date.parse("2020-03-11")), cases: 48, label: 18},
  {date: new Date(Date.parse("2020-03-12")), cases: 66, label: 18},
  {date: new Date(Date.parse("2020-03-13")), cases: 79, label: 18},
  {date: new Date(Date.parse("2020-03-14")), cases: 91, label: 18},
  {date: new Date(Date.parse("2020-03-15")), cases: 114, label: 18},
  {date: new Date(Date.parse("2020-03-16")), cases: 138, label: 18},
  {date: new Date(Date.parse("2020-03-17")), cases: 155, label: 18},
  {date: new Date(Date.parse("2020-03-18")), cases: 175, label: 18},
  {date: new Date(Date.parse("2020-03-19")), cases: 189, label: 18},
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

function TotalStatistic(props){
  const [count, setCount] = useState(0);

  useEffect(() => {
    axios.get("/data/total")
    .then((res) => {
      setCount(res.data["total"])
    });
  }, [])

  return (
    <div class="total-statistic">
      <p>There are currently {count} total confirmed cases of COVID-19 in Santa Clara County.</p>
    </div>
  )
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
    <div class="App-header">
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
          labels={({ datum }) => "asdf"+datum.label.toString()}
          labelComponent={<VictoryTooltip/>}
          size={({ active }) => active ? 5 : 3}
          animate={{
            duration: 2000,
            onLoad: { duration: 1000 }
          }}
        />
        <VictoryAxis
          tickValues={date_range}
          tickFormat={(t) => `${t.getMonth()+1}/${t.getDate()}`}
        />
      </VictoryChart>
    </div>
  )
}

function App() {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="App-header">
      <Header>
        <div style={{textAlign: "center"}}>
            <Title>
              COVID-19 @ Santa Clara County
            </Title>
        </div>
      </Header>
      <Content>
        <Row>
          <Col xs={{span: 24, offset: 2}} s={{span: 24, offset: 2}}>
            <TotalStatistic/>
            <CenterContent/>
          </Col>
        </Row>
      </Content>
    </div>
  );
}

export default App;
