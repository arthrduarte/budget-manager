import { useEffect, useState } from 'react'
import Navbar from './Navbar'
import Entries from './Entries'
import Chart from './Chart'

export default function Dashboard() {
  const [displayDate, setDisplayDate] = useState('')
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  const [month, setMonth] = useState(months[new Date().getMonth()])
  const [year, setYear] = useState(new Date().getFullYear())
  const [expenseAmount, setExpenseAmount] = useState(0)
  const [incomeAmount, setIncomeAmount] = useState(0)

  useEffect(() => {
    const monthIndex = months.indexOf(month) + 1;
    const formattedMonth = monthIndex < 10 ? `0${monthIndex}` : monthIndex;
    setDisplayDate(`${year}-${formattedMonth}`);
  }, [month])

  function datePicker(action: string) {
    const currentMonthIndex = months.indexOf(month);
    let newMonthIndex;
    if (action === 'increase') {
      newMonthIndex = (currentMonthIndex + 1) % months.length;
      setMonth(months[newMonthIndex]);
      if (newMonthIndex === 0) {
        setYear(year + 1);
      }
    } else if (action === 'decrease') {
      newMonthIndex = (currentMonthIndex - 1 + months.length) % months.length;
      setMonth(months[newMonthIndex]);
      if (newMonthIndex === months.length - 1) {
        setYear(year - 1);
      }
    }
  }

  return (
    <>
      <Navbar />
      <div className='flex flex-wrap'>
        <div className='w-full lg:w-1/2 my-5'>
          <div className='flex justify-center font-bold text-lg'>
            <p className='cursor-pointer' onClick={() => datePicker('decrease')}>&lt;</p>
            <h3 className='mx-5'>{month}</h3>
            <p className='cursor-pointer' onClick={() => datePicker('increase')}>&gt;</p>
          </div>
          <div className='w-full flex flex-row justify-center py-5'>
            <div className='bg-[#202938] px-3 py-1'>
              <p className='text-white font-bold'>Expenses:</p>
              <p className='text-red-500'>{expenseAmount}</p>
            </div>
            <div className='mx-5 bg-[#202938] px-3 py-1'>
              <p className='text-white font-bold'>Income:</p>
              <p className='text-green-500'>{incomeAmount}</p>
            </div>
            <div className='bg-[#202938] px-3 py-1'>
              <p className='text-white font-bold'>Balance:</p>
              <p className='text-white'>{incomeAmount - expenseAmount}</p> {/* Add logic for color */}
            </div>
          </div>
        </div>
        <div className='w-full lg:w-1/2'>
          <Chart typeOfData={['Expense', 'Income']} amount={[expenseAmount, incomeAmount]} />
        </div>
        <div className='w-full lg:w-1/2 my-5'>
          <Entries date={displayDate} typeOfEntry='expense' setAmountForChart={setExpenseAmount} />
        </div>
        <div className='w-full lg:w-1/2'>
          <Entries date={displayDate} typeOfEntry='income' setAmountForChart={setIncomeAmount} />
        </div>
      </div>
    </>
  )
}