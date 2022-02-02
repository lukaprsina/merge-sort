import React, { useEffect } from 'react';
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

/* function merge(left: number[], right: number[]): number[] {
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
} */

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
    }, 300);
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
    console.log(begin, mid, end)
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

function App() {
  let [field, setField] = React.useState<number[]>([]);
  let [number, setNumber] = React.useState(10);
  let [sorting, setSorting] = React.useState(false);

  let sorttest: MyType = (array, begin, number, end) => {
    setField(array);
  }

  return <>
    <Box sx={{
      display: 'flex',
      height: '60vh',
      justifyContent: 'space-between',
    }}>
      {
        field.map((height, i) => {
          return <Bar key={i} width={80 / field.length} height={height} />
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

      <Button variant="contained" disabled={sorting} onClick={async () => {
        setSorting(true);
        await merge_sort(field, sorttest);
        setSorting(false);
      }}>Sort</Button>
    </Box>
  </>;
}

export default App;
