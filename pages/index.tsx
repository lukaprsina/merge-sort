import React from 'react';
import { Box } from '@mui/system';
import { Button } from '@mui/material';

function Bar({ width, height }) {
  return <Box sx={{
    backgroundColor: 'lightgrey',
    width: String(width) + "%",
    height: String(height * 100) + "%",
  }}>
  </Box>
}

function genNew(num: number): number[] {
  return [...Array(num)].map(Math.random);
}

function merge(left, right) {
  let arr = []
  // Break out of loop if any one of the array gets empty
  while (left.length && right.length) {
    // Pick the smaller among the smallest element of left and right sub arrays 
    if (left[0] < right[0]) {
      arr.push(left.shift())
    } else {
      arr.push(right.shift())
    }
  }

  // Concatenating the leftover elements
  // (in case we didn't go through the entire left or right array)
  return [...arr, ...left, ...right]
}

function mergeSort(array) {
  const half = array.length / 2

  // Base case or terminating case
  if (array.length < 2) {
    return array
  }

  const left = array.splice(0, half)
  return merge(mergeSort(left), mergeSort(array))
}

function App() {
  let [field, setField] = React.useState(genNew(10));

  console.log(field)

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
      justifyContent: "center",
    }}>
      <Button variant="contained" onClick={() => {
        const temp = genNew(10);
        temp.push(...field);
        setField(temp);
      }}>Add</Button>
      <Button variant="contained" onClick={() => {
        setField(mergeSort(field));
      }}>Sort</Button>
    </Box>
  </>;
}

export default App;
