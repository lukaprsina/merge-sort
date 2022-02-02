import React from 'react';
import { Box } from '@mui/system';
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
  return [...Array(num)].map(Math.random);
}

function merge(left: number[], right: number[]): number[] {
  let arr: number[] = []
  while (left.length && right.length) {
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
  return [...arr, ...left, ...right]
}

async function mergeSort(array: number[], field: number[], setField: React.Dispatch<React.SetStateAction<number[]>>): Promise<number[]> {
  const whole = array.length;
  const half = whole / 2;

  if (array.length < 2) {
    return array
  }

  const left = array.splice(0, half)

  const myPromise = new Promise<number[]>(async (resolve, reject) => {
    setTimeout(async () => {
      console.log(half, whole)
      console.log(left, array, field)
      const test = merge(await mergeSort(left, field, setField), await mergeSort(array, field, setField));
      setField(test);
      resolve(test);
    }, 300);
  });


  return await myPromise;
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
          const temp = genNew(number);
          temp.push(...field);
          setField(temp);
        }}>Add</Button>

        <Button variant="contained" onClick={() => {
          let temp = field
          temp = temp.slice(number, temp.length - 1);
          setField(temp);
        }}>Remove</Button>

        <Button variant="contained" onClick={() => {
          let shuffled = field
            .map(value => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value)
          setField(shuffled);
        }}>Shuffle</Button>
      </Box>

      <Button variant="contained" onClick={async () => {
        await mergeSort(field, field, setField);
      }}>Sort</Button>
    </Box>
  </>;
}

export default App;
