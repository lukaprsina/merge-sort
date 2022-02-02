import React, { useEffect } from 'react';
import { Box } from '@mui/system';
import { Button, Input, Slider, Typography } from '@mui/material';

enum MyColor {
  Greater,
  Less,
  Equal,
  Outside
}

type BarProps = {
  height: number,
  width: number,
  cmp: MyColor
};

function Bar({ width, height, cmp }: BarProps) {
  let color: string;
  switch (cmp) {
    case MyColor.Greater:
      color = "pink";
      break;
    case MyColor.Less:
      color = "lightblue";
      break;
    case MyColor.Equal:
      color = "black";
      break;
    case MyColor.Outside:
      color = "lightgray";
      break;
  }
  return <Box sx={{
    backgroundColor: color,
    width: String(width) + "%",
    height: String(height * 100) + "%",
  }}>
  </Box>
}

function genNew(num: number): number[] {
  return [...Array(num)].map(Math.random);
}

type MyType = (array: number[], begin: number, mid: number, end: number) => any;

async function merge(a: number[], b: number[], begin: number, middle: number, end: number): Promise<number[]> {
  let i = begin;
  let j = middle;
  for (let k = begin; k < end; k++) {
    if (i < middle && (j >= end || a[i] <= a[j])) {
      b[k] = a[i];
      i = i + 1;
    } else {
      b[k] = a[j];
      j = j + 1;
    }
  }
  const myPromise = new Promise<number[]>(async (resolve, reject) => {
    setTimeout(async () => {
      resolve(b)
    }, WAIT_TIME);
  });

  return await myPromise;
}

async function merge_top_down(a: number[], b: number[], begin: number, end: number, setField: MyType): Promise<number[]> {
  if (end - begin <= 1)
    return [];

  let mid = Math.floor((end + begin) / 2);


  const myPromise = new Promise<number[]>(async (resolve, reject) => {
    await merge_top_down(b, a, begin, mid, setField);
    await merge_top_down(b, a, mid, end, setField);
    const test = await merge(b, a, begin, mid, end)
    setField(test, begin, mid, end);
    resolve(test);
  });

  return await myPromise;
}

async function merge_sort(a: number[], setField: MyType): Promise<number[]> {
  let b = [...a];
  await merge_top_down(a, b, 0, a.length, setField)
  return a;
}

let WAIT_TIME = 0;

function App() {
  let [field, setField] = React.useState<number[]>([]);
  let [number, setNumber] = React.useState(100);
  let [speed, setSpeed] = React.useState(5);
  let [sorting, setSorting] = React.useState(false);
  let [bounds, setBounds] = React.useState<{ begin: number, mid: number, end: number }>({ begin: 0, mid: Math.floor(field.length), end: field.length });

  let sorttest: MyType = (array, begin, mid, end) => {
    setField(array);
    setBounds({ begin, mid, end });
  }

  WAIT_TIME = 30_000 / (field.length * Math.pow(speed, 1.5)) + (30 * Math.pow(speed, -2));
  console.log(WAIT_TIME, field.length, speed);

  return <>
    <Box sx={{
      display: 'flex',
      height: '60vh',
      justifyContent: 'space-between',
    }}>
      {

        field.map((height, i) => {
          let cmp: MyColor;
          if (i < bounds.begin || i >= bounds.end) {
            cmp = MyColor.Outside;
          }
          else if (i == bounds.mid) {
            cmp = MyColor.Equal;
          }
          else if (i < bounds.mid) {
            cmp = MyColor.Less;
          }
          else {
            cmp = MyColor.Greater;
          }
          return <Bar key={i} width={80 / field.length} height={height} cmp={cmp} />
        })
      }
    </Box>
    <Box sx={{
      display: "flex",
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
      gap: "20px 20px"
    }}>
      <Box sx={{ width: "100%", justifyContent: "center", display: "flex", gap: "20px 20px" }}>
        <Input type="number" value={number} onChange={(e) => setNumber(parseInt(e.target.value))}></Input>
        <Button variant="contained" disabled={sorting} onClick={() => {
          const temp = genNew(number);
          temp.push(...field);
          setField(temp);
        }}>Add</Button>

        <Button variant="contained" disabled={sorting} onClick={() => {
          let temp = field
          temp = temp.slice(number, temp.length - 1);
          setField(temp);
        }}>Remove</Button>

        <Button variant="contained" disabled={sorting} onClick={() => {
          let shuffled = field
            .map(value => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value)
          setField(shuffled);
        }}>Shuffle</Button>
      </Box>
      <Typography>Speed</Typography>
      <Slider min={1} max={10} marks step={1} value={speed} onChange={(e) => {
        if (e && e.target && (e.target as HTMLInputElement).value) {
          const test = parseInt((e.target as HTMLInputElement).value);
          setSpeed(test);
        }
      }}></Slider>
      <Button variant="contained" disabled={sorting} onClick={async () => {
        setSorting(true);
        await merge_sort(field, sorttest);
        setSorting(false);
        setTimeout(() => {
          setBounds({ begin: field.length, mid: field.length, end: field.length });
        }, 300);
      }}>Sort</Button>
    </Box >
  </>;
}

export default App;
