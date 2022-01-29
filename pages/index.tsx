import React from 'react';
import { Box, textAlign } from '@mui/system';
import { Button, Input } from '@mui/material';

type BarProps = {
  height: number,
  width: number,
};

function Bar({ width, height }: BarProps) {
  return <Box sx={{
    backgroundColor: 'lightgrey',
    width: String(width) + "%",
    height: String(height * 100) + "%",
  }}>
  </Box>
}

function genNew(num: number): number[] {
  console.log("Generating " + num)
  return [...Array(num)].map(Math.random);
}

function merge(left: number[], right: number[]): number[] {
  let arr: number[] = []
  // Break out of loop if any one of the array gets empty
  while (left.length && right.length) {
    // Pick the smaller among the smallest element of left and right sub arrays 
    let num;
    if (left[0] < right[0]) {
      num = left.shift();
    } else {
      num = right.shift();
    }
    if (num) {
      arr.push(num)
    }
  }

  // Concatenating the leftover elements
  // (in case we didn't go through the entire left or right array)
  return [...arr, ...left, ...right]
}

function mergeSort(array: number[]): number[] {
  const half = array.length / 2

  // Base case or terminating case
  if (array.length < 2) {
    return array
  }

  const left = array.splice(0, half)
  return merge(mergeSort(left), mergeSort(array))
}

function App() {
  let [field, setField] = React.useState<number[]>([]);
  let [number, setNumber] = React.useState(10);

  return <>
    <Box sx={{
      display: 'flex',
      height: '60vh',
      justifyContent: 'space-between',
    }}>
      {
        field.map((height, i) =>
          <Bar key={i} width={80 / field.length} height={height} />
        )
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
        <Button variant="contained" onClick={() => {
          console.log(number, field)
          const temp = genNew(number);
          temp.push(...field);
          setField(temp);
        }}>Add</Button>

        <Button variant="contained" onClick={() => {
          console.log(number, field)
          let temp = field
          temp = temp.slice(number, temp.length - 1);
          setField(temp);
        }}>Remove</Button>
      </Box>

      <Button variant="contained" onClick={() => {
        setField(mergeSort(field));
      }}>Sort</Button>
    </Box>
  </>;
}

export default App;
