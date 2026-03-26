import React, { useState, useEffect } from "react";
import { Badge, Calendar, Select, Radio, Row, Col, theme } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { getCalenderData } from "../store/dataSlice";
import moment from "moment";

const EmployeeCalendar = ({selectedCalender}) => {
useEffect(() => {
  setData((prevData) => ({
    ...prevData,
    EMP_ID: selectedCalender,
  }));
}, [selectedCalender]);
  const [data, setData] = useState({
    MONTH: null,
    YEAR: null,
    EMP_ID: selectedCalender,
  });
  const { token } = theme.useToken();
  const dispatch = useDispatch();

  const employeeList = useSelector(
    (state) => state.employee.data.employeeIdList?.data
  );
  const calenderData = useSelector(
    (state) => state.employee.data.calenderDataList?.data
  );

  useEffect(() => {
    if (data.YEAR && data.MONTH && data.EMP_ID) {
      dispatch(getCalenderData(data));
    }
  }, [data]);

  const parseCalendarData = (data, year, month) => {
    const dayInData = {};
    const dayOutData = {};
    const daysInMonth = moment(`${year}-${month}`, "YYYY-MM").daysInMonth();
    data.forEach((item) => {
      for (let day = 1; day <= daysInMonth; day++) {
        const dayInKey = `DAYIN_${day}`;
        const dayOutKey = `DAYOUT_${day}`;
        if (item[dayInKey]) {
          dayInData[day] = item[dayInKey];
        }
        if (item[dayOutKey]) {
          dayOutData[day] = item[dayOutKey];
        }
      }
    });
    return { dayInData, dayOutData };
  };

  const { dayInData, dayOutData } = parseCalendarData(calenderData || [], data.YEAR, data.MONTH);

  const dateCellRender = (value) => {
    const day = value.date();
    const dayIn = dayInData[day];
    const dayOut = dayOutData[day];
    const isCurrentMonth = value.month() + 1 === data.MONTH && value.year() === data.YEAR;
    const style = {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: isCurrentMonth && (dayIn || dayOut) ? "#BAF478" : "#FCA48D",
      color: isCurrentMonth && (dayIn || dayOut) ? "white" : undefined,
    };

    const convertTo12HrFormat = (time) => {
      const [hours, minutes, seconds] = time.split(":");
      const date = new Date();
      date.setHours(+hours, +minutes, +seconds);

      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
    };

    return (
      <div style={style}>
        {isCurrentMonth && dayIn && (
          <div>
            <Badge status="success" text={`In: ${convertTo12HrFormat(dayIn)}`} />
          </div>
        )}
        {isCurrentMonth && dayOut && (
          <div>
            <Badge status="error" text={`Out: ${convertTo12HrFormat(dayOut)}`} />
          </div>
        )}
      </div>
    );
  };

  const handleChange = (key, value) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const onPanelChange = (value) => {
    handleChange("YEAR", value.year());
    handleChange("MONTH", value.month() + 1); // Month is 0-indexed, so add 1
  };

  const wrapperStyle = {
    width: 1000,
    border: `1px solid ${token.colorBorderSecondary}`,
    borderRadius: token.borderRadiusLG,
  };

  const { Option } = Select;

  return (
    <>
      <div style={wrapperStyle}>
        <Calendar
          cellRender={dateCellRender}
          headerRender={({ value, type, onChange, onTypeChange }) => {
            const start = 0;
            const end = 11;
            const monthOptions = [];
            let current = value.clone();
            const localeData = value.localeData();
            const months = [];
            for (let i = start; i <= end; i++) {
              current = current.month(i);
              months.push(localeData.monthsShort(current));
            }
            for (let i = start; i <= end; i++) {
              monthOptions.push(
                <Select.Option key={i + 1} value={i + 1} className="month-item">
                  {months[i]}
                </Select.Option>
              );
            }
            const year = value.year();
            const options = [];
            for (let i = 2024; i >= 2020; i -= 1) {
              options.push(
                <Select.Option key={i} value={i} className="year-item">
                  {i}
                </Select.Option>
              );
            }

            return (
              <div style={{ padding: 8 }}>
                <Row gutter={4}>
                  <Col>
                    <Radio.Group
                      size="small"
                      onChange={(e) => onTypeChange(e.target.value)}
                      value={type}
                    >
                      <Radio.Button value="month">Month</Radio.Button>
                      <Radio.Button value="year">Year</Radio.Button>
                    </Radio.Group>
                  </Col>
                  <Col>
                    <Select
                      size="small"
                      dropdownMatchSelectWidth={false}
                      placeholder="Select Year"
                      className="my-year-select"
                      onChange={(year) => {
                        handleChange("YEAR", year);
                        onChange(value.year(year)); // Adjust the calendar view
                      }}
                    >
                      {options}
                    </Select>
                  </Col>
                  <Col>
                    <Select
                      size="small"
                      dropdownMatchSelectWidth={false}
                      placeholder="Select Month"
                      onChange={(month) => {
                        handleChange("MONTH", month);
                        onChange(value.month(month - 1)); // Adjust month to be 0-indexed
                      }}
                    >
                      {monthOptions}
                    </Select>
                  </Col>
                  <Col>
                    <Select
                      size="small"
                      placeholder="Select Employee"
                      onChange={(value) => handleChange("EMP_ID", value)}
                      className="h-[40px] rounded"
                    >
                      {employeeList?.map((type) => (
                        <Option
                          key={type.ID}
                          value={type.ID}
                          className="text-gray-400"
                        >
                          {type.FIRST_NAME}
                        </Option>
                      ))}
                    </Select>
                  </Col>
                </Row>
              </div>
            );
          }}
          onPanelChange={onPanelChange}
        />
      </div>
    </>
  );
};

export default EmployeeCalendar;
