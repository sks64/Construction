import React from 'react'
import { Card } from "antd";
import { useSelector } from "react-redux";
const EmployeeCard = () => {
    const employeeTotal = useSelector((state) => state.employee.data.employeeList?.employeeCount
);
  return (
    <>
    {employeeTotal?.map((item, index) => (
        <div key={index} className="flex gap-10 flex-wrap justify-center">
          <Card
            style={{
              width: 150,
              height: 70,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
            className=" rounded-xl bg-blue-600  text-white text-center "
          >
            <p className="text-xl font-semibold  ">Total</p>
            {/* <hr style={{width:'100px'}} className='border border-black  '/> */}
            <p className="text-xl  ">{item.TOTAL}</p>
          </Card>
          <Card
            style={{
              width: 150,
              height: 70,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
            className=" rounded-xl text-center text-white bg-emerald-800"
          >
            <p className="text-xl  font-semibold">Active</p>
            <p className="text-xl ">{item.TOTAL_ACTIVE}</p>
          </Card>
          <Card
            style={{
              width: 150,
              height: 70,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
            className=" rounded-xl text-center text-white bg-red-600"
          >
            <p className="text-xl  font-semibold">In Active</p>
            <p className="text-xl  ">{item.TOTAL_INACTIVE}</p>
          </Card>
          
        </div>
      ))}
    </>
  )
}

export default EmployeeCard