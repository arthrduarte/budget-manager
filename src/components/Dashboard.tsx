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
      <div>
        <div className='flex flex-col items-center'>
          <div>
            <h3 className='font-bold text-lg'>{year}</h3>
          </div>
          <div className='flex w-1/6 justify-between font-bold text-lg'>
            <p className='cursor-pointer' onClick={() => datePicker('decrease')}>&lt;</p>
            <h3 className='mx-5'>{month}</h3>
            <p className='cursor-pointer' onClick={() => datePicker('increase')}>&gt;</p>
          </div>
        </div>
        <div className='flex flex-col lg:flex-row'>
          <Entries date={displayDate} typeOfEntry='expense' setAmountForChart={setExpenseAmount} />
          <Entries date={displayDate} typeOfEntry='income' setAmountForChart={setIncomeAmount} />
        </div>
      </div>
      <div className='w-1/2 py-5 mx-auto'>
        <Chart typeOfData={['Expense', 'Income']} amount={[expenseAmount, incomeAmount]} />
      </div>
    </>
  )
}