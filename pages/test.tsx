import React from 'react';
import { Box } from '@mui/system';
import { Button, Input } from '@mui/material';

async function mergeSort(arr: number[], n: number) {
  let curr_size: number;
  let left_start: number;
  for (curr_size = 1; curr_size <= n - 1; curr_size = 2 * curr_size) {
    for (left_start = 0; left_start < n - 1; left_start += 2 * curr_size) {
      var mid = Math.min(left_start + curr_size - 1, n - 1);
      var right_end = Math.min(left_start + 2 * curr_size - 1, n - 1);

      setTimeout(async () => {
        merge(arr, left_start, mid, right_end);
      }, 300);
    }
  }
}

function merge(arr: number[], l: number, m: number, r: number) {
  var i, j, k;
  var n1 = m - l + 1;
  var n2 = r - m;

  var L = Array(n1).fill(0);
  var R = Array(n2).fill(0);

  for (i = 0; i < n1; i++)
    L[i] = arr[l + i];
  for (j = 0; j < n2; j++)
    R[j] = arr[m + 1 + j];

  i = 0;
  j = 0;
  k = l;
  while (i < n1 && j < n2) {
    if (L[i] <= R[j]) {
      arr[k] = L[i];
      i++;
    } else {
      arr[k] = R[j];
      j++;
    }
    k++;
  }

  while (i < n1) {
    arr[k] = L[i];
    i++;
    k++;
  }

  while (j < n2) {
    arr[k] = R[j];
    j++;
    k++;
  }
}

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

async function App() {
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

      <Button variant="contained" onClick={async () => {
        setField(await mergeSort(field, field.length));
      }}>Sort</Button>
    </Box>
  </>;
}

export default App;
