import { useState } from "react";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import IconCalendar from "/src/assets/svg/calendar.svg";
import IconChevronDown from "/src/assets/svg/chevron-down.svg";

const MobileFilterModal = ({ isOpen, onClose, filters, onFilterChange, onDateChange, onSubmit }) => {
    const [showFromCalendar, setShowFromCalendar] = useState(false);
    const [showToCalendar, setShowToCalendar] = useState(false);

    if (!isOpen) return null;

    const formatDate = (date) => {
        if (!date) return '';
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).replace(/\//g, '.');
    };

    const CustomDateInput = ({ date, onClick, placeholder }) => (
        <div className="input-date-mobile__custom-date-input" onClick={onClick}>
            <span className="input-date-mobile__custom-date-input-calendar">
                <span className="SVGInline SVG-component__content">
                    <img className="SVGInline-svg SVG-component__content-svg" src={IconCalendar} alt="calendar" />
                </span>
            </span>
            <span className="input-date-mobile__custom-date-input-value">
                {date ? formatDate(date) : placeholder}
            </span>
            <span className="input-date-mobile__custom-date-input-arrow">
                <span className="SVGInline SVG-component__content">
                    <img className="SVGInline-svg SVG-component__content-svg" src={IconChevronDown} alt="dropdown" />
                </span>
            </span>
        </div>
    );

    const handleFilterChange = (e) => {
        const { name, checked } = e.target;
        onFilterChange(name, checked);
    };

    const handleSubmit = () => {
        onSubmit();
        onClose();
    };

    return (
        <div className="modal d-block" onClick={onClose}>
            <div className="modal__content-container" onClick={(e) => e.stopPropagation()}>
                <div className="pay-history-mobile__filter">
                    <div className="pay-history-mobile__filter-title">Mostrar operaciones</div>
                    <div className="pay-history-mobile__filter-select-multi">
                        <ul className="select-multi-mobile">
                            <li className="select-multi-mobile__item">
                                <div className="select-multi-mobile__checkbox">
                                    <label className="check-box-desktop">
                                        <input
                                            id="cancelled-checkbox"
                                            className="check-box-desktop__input"
                                            type="checkbox"
                                            name="cancelled"
                                            checked={filters.status.cancelled}
                                            onChange={handleFilterChange}
                                        />
                                        <span className="check-box-desktop__checkmark"></span>
                                    </label>
                                </div>
                                <label className="select-multi-desktop__item-value" htmlFor="cancelled-checkbox">Canceladas</label>
                            </li>
                            <li className="select-multi-mobile__item">
                                <div className="select-multi-mobile__checkbox">
                                    <label className="check-box-desktop">
                                        <input
                                            id="pending-checkbox"
                                            className="check-box-desktop__input"
                                            type="checkbox"
                                            name="pending"
                                            checked={filters.status.pending}
                                            onChange={handleFilterChange}
                                        />
                                        <span className="check-box-desktop__checkmark"></span>
                                    </label>
                                </div>
                                <label className="select-multi-mobile__item-value" htmlFor="pending-checkbox">Pendientes</label>
                            </li>
                            <li className="select-multi-mobile__item">
                                <div className="select-multi-mobile__checkbox">
                                    <label className="check-box-desktop">
                                        <input
                                            id="completed-checkbox"
                                            className="check-box-desktop__input"
                                            type="checkbox"
                                            name="completed"
                                            checked={filters.status.completed}
                                            onChange={handleFilterChange}
                                        />
                                        <span className="check-box-desktop__checkmark"></span>
                                    </label>
                                </div>
                                <label className="select-multi-mobile__item-value" htmlFor="completed-checkbox">Realizadas</label>
                            </li>
                        </ul>
                    </div>
                    <form className="slots-bets-filter-pay-history-mobile" onSubmit={handleSubmit}>
                        <div className="slots-bets-filter-pay-history-mobile__values">
                            <div className="slots-bets-filter-pay-history-mobile__item">
                                <span className="slots-bets-filter-pay-history-mobile__item-label">Fecha de</span>
                                <div className="slots-bets-filter-pay-history-mobile__item-input">
                                    <div className="input-date-mobile">
                                        <CustomDateInput
                                            date={filters.dateFrom}
                                            onClick={() => setShowFromCalendar(!showFromCalendar)}
                                            placeholder="Seleccionar fecha"
                                        />
                                        {showFromCalendar && (
                                            <div className="calendar-popup-mobile">
                                                <Calendar
                                                    value={filters.dateFrom}
                                                    onChange={(date) => {
                                                        onDateChange(date, "dateFrom");
                                                        setShowFromCalendar(false);
                                                    }}
                                                    maxDate={filters.dateTo}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="slots-bets-filter-pay-history-mobile__item">
                                <span className="slots-bets-filter-pay-history-mobile__item-label">Fecha hasta</span>
                                <div className="slots-bets-filter-pay-history-mobile__item-input">
                                    <div className="input-date-mobile">
                                        <CustomDateInput
                                            date={filters.dateTo}
                                            onClick={() => setShowToCalendar(!showToCalendar)}
                                            placeholder="Seleccionar fecha"
                                        />
                                        {showToCalendar && (
                                            <div className="calendar-popup-mobile">
                                                <Calendar
                                                    value={filters.dateTo}
                                                    onChange={(date) => {
                                                        onDateChange(date, "dateTo");
                                                        setShowToCalendar(false);
                                                    }}
                                                    minDate={filters.dateFrom}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="slots-bets-filter-pay-history-mobile__button">
                            <button type="submit" className="button-mobile button-mobile_color_default button-mobile_borderRadius_500">
                                Aceptar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default MobileFilterModal;