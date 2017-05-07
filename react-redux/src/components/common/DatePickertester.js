import React from 'react';
import DayPicker, { DateUtils } from 'react-day-picker';
import moment from 'moment';
import cx from 'classnames';
import YearMonthForm from './YearMonthForm';
import s from './DatePicker.scss';

const currentYear = new Date().getFullYear();
const fromMonth = new Date(currentYear, 0, 1, 0, 0);
const toMonth = new Date(currentYear + 10, 11, 31, 23, 59);

class DatePicker extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      from: null,
      to: null,
      showOverlay: false,
      value: moment().format('L'), // The value of the input field
      month: new Date(), // The month to display in the calendar
      showDatePicker: false, // Show/Hide date picker
      enteredTo: null
    };
    this.clickedInside = false;
    this.input = null;
    this.showCurrentDate = this.showCurrentDate.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleDayClick = this.handleDayClick.bind(this);
    this.handleYearMonthChange = this.handleYearMonthChange.bind(this);
    this.handleContainerMouseDown = this.handleContainerMouseDown.bind(this);
    this.handleInputBlur = this.handleInputBlur.bind(this);
    this.resetShowOverlay = this.resetShowOverlay.bind(this);
    this.reset = this.reset.bind(this);
  }

  reset() {
    this.setState({
      from: null,
      to: null,
      enteredTo: null
    });
  }
  resetShowOverlay() {
    this.setState({
      showOverlay: !this.state.showOverlay
    });
  }
  showCurrentDate() {
    this.setState({
      showDatePicker: true
    });
    this.dateInput.focus();
    //  this.daypicker.showMonth(this.state.month);
  }
  handleInputBlur() {
    const showDatePicker = this.clickedInside;
    this.setState({
      showDatePicker
    });

    // Force input's focus if blur event was caused by clicking on the calendar
    if (showDatePicker) {
      this.dateInput.focus();
    }
  }
  handleContainerMouseDown() {
    this.clickedInside = true;
    setTimeout(() => {
      this.clickedInside = false;
    }, 0);
  }
  handleInputChange(e) {
    const { value } = e.target;

    // Change the current month only if the value entered by the user
    // is a valid date, according to the `L` format
    if (moment(value, 'L', true).isValid()) {
      this.setState(
        {
          month: moment(value, 'L').toDate(),
          value
        },
        this.showCurrentDate
      );
    } else {
      this.setState({ value }, this.showCurrentDate);
    }
  }

  handleDayClick(day) {
    const range = DateUtils.addDayToRange(day, this.state);
    this.setState(range);
    if (this.state.from && this.state.to) {
      this.setState({ showOverlay: false });
    }
  }

  handleYearMonthChange(month) {
    this.setState({ month });
  }

  render() {
    const { from, to } = this.state;
    const fieldIcon = cx(s.fieldIcon, 'glyphicon glyphicon-calendar');
    const selectedDay = from ? `${moment(from).format('L')} ${'-'} ${moment(to).format('L')}` : '';
    return (
      <div className={s.datePickerContainer} onMouseDown={this.handleContainerMouseDown}>
        <p className={s.fieldWrapper}>
          <input
            type="text"
            ref={input => { this.dateInput = input; }}
            value={selectedDay}
            placeholder="MM/DD/YYYY"
            onClick={this.resetShowOverlay}
            onChange={this.handleInputChange}
            onFocus={this.showCurrentDate}
            onBlur={this.handleInputBlur}
          />
          <i className={fieldIcon} onClick={this.showCurrentDate}/>
        </p>
        <div>
          {this.state.showDatePicker &&
          <div className={s.datePickerPosition}>
            <div className={s.overlayStyle}>
              <DayPicker
                month={this.state.month}
                fromMonth={fromMonth}
                toMonth={toMonth}
                dateFormat="dd-mm-yyyy"
                onDayClick={this.handleDayClick}
                selectedDays={[from, { from, to }]}
                canChangeMonth={false}
                captionElement={
            <YearMonthForm onChange={this.handleYearMonthChange} />
          }
              />
            </div>
          </div>}

        </div>
      </div>

    );
  }
}

export default DatePicker;
