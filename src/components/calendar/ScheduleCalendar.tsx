import { Calendar, dateFnsLocalizer, View } from "react-big-calendar";
import { format, parse, startOfWeek, getDay, isEqual } from "date-fns";
import enUS from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Schedule } from "../../type/CommonInterfaces";
import { useState, useCallback, useRef, useContext, useEffect } from "react";
import ScheduleInputPopUpBox from "../schedule/ScheduleInputPopUpBox";
import { Context, State } from "../../index";
import { getStartAndEndDate } from "../../utils/calendar/CalendarUtils";
import {
	createUserProfile,
	deleteUserProfile,
	getUserProfile,
	updateUserProfile,
} from "../../utils/api/UserAPI";
import { Box } from "@mui/material";
import { CalendarMenu } from "./CalendarMenu";

const locales = {
	"en-US": enUS,
};

const localizer = dateFnsLocalizer({
	format,
	parse,
	startOfWeek,
	getDay,
	locales,
});

interface ScheduleCalendarProp {
	schedulesOfCurrentMonth: Map<number, Schedule>;
	onCreateSchedule: (schedule: Schedule) => void;
	onUpdateSchedule: (schedule: Schedule) => void;
	onDeleteSchedule: (schedule: Schedule) => void;
	onMoveDate: any;
}
function getDefaultSchedule(): Schedule {
	return {
		id: 0,
		title: "",
		name: "test name", // FIXME: 이름 가져오기
		start: new Date(),
		end: new Date(),
		content: "",
	};
}
const drawerWidth = 120;
function ScheduleCalendar({
	schedulesOfCurrentMonth,
	onCreateSchedule,
	onUpdateSchedule,
	onDeleteSchedule,
	onMoveDate,
}: ScheduleCalendarProp) {
	const [isSelectSlot, setIsSelectSlot] = useState<boolean>(false);
	const [isSelectEvent, setIsSelectEvent] = useState<boolean>(false);
	const [startDay, setStartDay] = useState<Date>(new Date());
	const [endDay, setEndDay] = useState<Date>(new Date());
	const defaultPropForScheduleBox = useRef<Schedule>(getDefaultSchedule());
	const { url }: State = useContext(Context);
	// useEffect(() => {
	// 	const userId = "roonm813";
	// 	const pw = "testpassword";
	// 	const discordId = "538799426479840000";
	// 	// USER
	// 	console.log(createUserProfile(url, userId, pw, discordId));
	// 	console.log(
	// 		getUserProfile(url, userId).then((response) => response.json())
	// 	);
	// 	console.log(
	// 		updateUserProfile(url, userId, pw, "update memo").then((response) =>
	// 			response.json()
	// 		)
	// 	);
	// 	console.log(deleteUserProfile(url, userId));

	// }, []);

	useEffect(() => {
		onMoveDate(startDay, endDay);
	}, [startDay, endDay]);

	const addEvent = (date: Date) => {
		defaultPropForScheduleBox.current = getDefaultSchedule();
		defaultPropForScheduleBox.current.start = date;
		defaultPropForScheduleBox.current.end = date;
		setIsSelectSlot(true);
	};

	const handleSelectSlot = useCallback((slotInfo: any) => {
		const date = slotInfo.slots[0];
		addEvent(date);
		setIsSelectSlot(true);
	}, []);

	const handleSelectEvent = useCallback((event: Schedule) => {
		defaultPropForScheduleBox.current = event;
		setIsSelectEvent(true);

		// console.log(event);
	}, []);

	const handleCloseSchedulePopupBox = () => {
		setIsSelectSlot(false);
		setIsSelectEvent(false);
	};

	const handleNavigate = (date: Date, view: View) => {
		// console.log("navigate: ", date.toDateString());
		// console.log(getStartAndEndDate(date, view));
		const { start, end } = getStartAndEndDate(date, "month");
		if (isEqual(startDay, start!) === false) {
			setStartDay(start!);
			setEndDay(end!);
		}
	};

	return (
		<>
			<CalendarMenu addEvent={() => addEvent(new Date())} />
			<Box
				component="main"
				sx={{
					flexGrow: 1,
					p: 3,
					// paddingLeft: 3,
					paddingLeft: { xs: 3, sm: `${drawerWidth}px` },
					width: { sm: `calc(100% - ${drawerWidth}px)` },
				}}
			>
				<Calendar
					localizer={localizer}
					style={{ minWidth: 600, height: 800 }}
					events={Array.from(schedulesOfCurrentMonth.values())}
					startAccessor="start"
					endAccessor="end"
					titleAccessor="name"
					selectable
					onSelectSlot={handleSelectSlot}
					onSelectEvent={handleSelectEvent}
					onNavigate={handleNavigate}
					views={["month", "day", "agenda"]}
					popup
				></Calendar>
				{isSelectSlot && (
					<ScheduleInputPopUpBox
						defaultSchedule={defaultPropForScheduleBox.current}
						open={isSelectSlot}
						readonly={false}
						onClose={handleCloseSchedulePopupBox}
						onSave={onCreateSchedule}
						onUpdate={onUpdateSchedule}
						onDelete={onDeleteSchedule}
					></ScheduleInputPopUpBox>
				)}
				{isSelectEvent && (
					<ScheduleInputPopUpBox
						defaultSchedule={defaultPropForScheduleBox.current}
						open={isSelectEvent}
						readonly={true}
						onClose={handleCloseSchedulePopupBox}
						onSave={onCreateSchedule}
						onUpdate={onUpdateSchedule}
						onDelete={onDeleteSchedule}
					></ScheduleInputPopUpBox>
				)}
			</Box>
		</>
	);
}
export default ScheduleCalendar;
