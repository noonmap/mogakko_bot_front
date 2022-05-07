import styled, { css } from "styled-components";
import PropTypes from "prop-types";
import { useState, useEffect, forwardRef } from "react";
import { ko } from "date-fns/esm/locale";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

//TODO: ScheduleInputBox로 이름 변경하기
function TimeInputBox({ timeText, schedMinDate, TimeCallBack }) {
	const [time, setTime] = useState("12:00");
	const [date, setDate] = useState(schedMinDate);
	const [minDate, setMinDate] = useState(schedMinDate);

	useEffect(() => {
		setMinDate(schedMinDate);
	}, [schedMinDate]);

	const onChangeTime = (event) => {
		// TODO: date picker의 clock으로 바꾸기
		setTime(event.target.value);
		const [hour, minute] = event.target.value.split(":", 2);
		date.setHours(Number(hour), Number(minute));
		TimeCallBack(date);
	};
	const onChangeDate = (_date) => {
		setDate(_date);
		const [hour, minute] = time.split(":", 2);
		_date.setHours(Number(hour), Number(minute));
		TimeCallBack(_date);
	};
	const CustomDateInput = forwardRef(({ value, onClick, onChange }, ref) => (
		<DateInput
			value={value}
			onClick={onClick}
			onChange={onChange}
			ref={ref}
		></DateInput>
	));
	return (
		<TimeBox>
			<Text>{timeText}</Text>
			<DateWrapper>
				<DatePicker
					selected={date}
					locale={ko}
					onChange={(date) => onChangeDate(date)}
					dateFormat="yyyy-MM-dd (eee)"
					minDate={minDate}
					customInput={<CustomDateInput />}
				></DatePicker>
			</DateWrapper>
			<DateWrapper>
				<TimeInput value={time} mode="time" onChange={onChangeTime}></TimeInput>
			</DateWrapper>
		</TimeBox>
	);
}

TimeInputBox.propTypes = {
	timeText: PropTypes.string.isRequired,
	schedMinDate: PropTypes.instanceOf(Date).isRequired,
	TimeCallBack: PropTypes.func.isRequired,
};

const TimeBox = styled.div`
	margin-top: 10px;
	margin-bottom: 10px;
	display: flex;
`;
const TimeBoxElement = css`
	width: 30%;
	height: 20px;
	margin: auto;
`;
const Text = styled.div`
	${TimeBoxElement}
`;
const DateWrapper = styled.div`
	${TimeBoxElement}
`;
const DateInput = styled.input`
	box-sizing: border-box;
	width: 100%;
	height: 100%;

	border: 1px;
	border-radius: 5px;

	text-align: center;
	display: block;
`;
const TimeInput = styled.input.attrs({
	type: "time",
	step: "600",
	required: true,
})`
	box-sizing: border-box;
	width: 100%;
	height: 100%;

	border: 1px;
	border-radius: 5px;

	text-align: center;
	display: block;
`;
export default TimeInputBox;