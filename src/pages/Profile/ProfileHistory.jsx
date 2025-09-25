import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Calendar from 'react-calendar';
import { AppContext } from "../../AppContext";
import { callApi } from "../../utils/Utils";
import DivLoading from "../../components/DivLoading";
import IconChevronLeft from "/src/assets/svg/chevron-left.svg";
import IconChevronRight from "/src/assets/svg/chevron-right.svg";
import IconDoubleLeft from "/src/assets/svg/double-arrow-left.svg";
import IconDoubleRight from "/src/assets/svg/double-arrow-right.svg";
import IconFilter from "/src/assets/svg/filter.svg";

const ProfileHistory = () => {
    const navigate = useNavigate();
    const { contextData } = useContext(AppContext);

    const getDefaultDates = () => {
        const now = new Date();
        const currentMonthFirst = new Date(now.getFullYear(), now.getMonth(), 1);
        const nextMonthFirst = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        return { dateFrom: currentMonthFirst, dateTo: nextMonthFirst };
    };

    const [filters, setFilters] = useState(getDefaultDates());
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showHistory, setShowHistory] = useState(true);
    const [pagination, setPagination] = useState({
        start: 0,
        length: 5,
        totalRecords: 0,
        currentPage: 1,
    });

    const [showFromCalendar, setShowFromCalendar] = useState(false);
    const [showToCalendar, setShowToCalendar] = useState(false);

    const formatDate = (date) => {
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).replace(/\//g, '.');
    };

    const CustomFromInput = () => (
        <button className="date-picker-wrapper_datePickerButton" onClick={() => setShowFromCalendar(!showFromCalendar)}>
            <span className="date-picker-wrapper_datePickerButtonContent date-picker-wrapper_hasValue">
                <span className="date-picker-wrapper_datePickerButtonLabel">From</span><span className="date-picker-wrapper_datePickerButtonValue">{formatDate(filters.dateFrom)}</span>
            </span>
            <span className="date-picker-wrapper_datePickerButtonArrow">
                <img src={IconChevronLeft} />
            </span>
        </button>
    );

    const CustomToInput = () => (
        <button className="date-picker-wrapper_datePickerButton" onClick={() => setShowToCalendar(!showToCalendar)}>
            <span className="date-picker-wrapper_datePickerButtonContent date-picker-wrapper_hasValue">
                <span className="date-picker-wrapper_datePickerButtonLabel">To</span><span className="date-picker-wrapper_datePickerButtonValue">{formatDate(filters.dateTo)}</span>
            </span>
            <span className="date-picker-wrapper_datePickerButtonArrow">
                <img src={IconChevronLeft} />
            </span>
        </button>
    );

    const handleFilterChange = (name, checked) => {
        setFilters((prev) => ({
            ...prev,
            status: { ...prev.status, [name]: checked },
        }));
    };

    const handleDateChange = (date, name) => {
        setFilters((prev) => ({ ...prev, [name]: date }));
    };

    const handlePageChange = (page) => {
        setPagination((prev) => ({
            ...prev,
            start: (page - 1) * prev.length,
            currentPage: page,
        }));
    };

    const fetchHistory = () => {
        setLoading(true);

        const formatDateForAPI = (date) => {
            if (!date) return '';
            const d = new Date(date);
            return d.toISOString().split('T')[0];
        };

        const queryParams = new URLSearchParams({
            start: pagination.start,
            length: pagination.length,
            type: "slot",
            ...(filters.dateFrom && { date_from: formatDateForAPI(filters.dateFrom) }),
            ...(filters.dateTo && { date_to: formatDateForAPI(filters.dateTo) }),
        }).toString();

        callApi(
            contextData,
            "GET",
            `/get-history?${queryParams}`,
            (response) => {
                if (response.status === "0") {
                    setTransactions(response.data);
                    setPagination((prev) => ({
                        ...prev,
                        totalRecords: response.recordsTotal || 0,
                    }));
                } else {
                    setTransactions([]);
                    console.error("API error:", response);
                }
                setLoading(false);
            },
            null
        );
    };

    const handleSubmit = (e) => {
        if (e && e.preventDefault) {
            e.preventDefault();
        }
        setPagination((prev) => ({ ...prev, start: 0, currentPage: 1 }));
        fetchHistory();
    };

    useEffect(() => {
        fetchHistory();
    }, [pagination.start, pagination.length]);

    const formatDateDisplay = (dateString) => {
        const date = new Date(dateString);
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const day = date.getDate();
        const month = months[date.getMonth()];
        const year = date.getFullYear();

        return `${hours}:${minutes} ${day} ${month} ${year}`;
    };

    const formatBalance = (value) => {
        const num = parseFloat(value);
        return num.toLocaleString('de-DE', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    const formatOperation = (operation) => {
        return operation === "change_balance" ? "change balance" : operation;
    };

    const totalPages = Math.ceil(pagination.totalRecords / pagination.length);

    const getVisiblePages = () => {
        const delta = 1;
        const visiblePages = [];
        let startPage = Math.max(1, pagination.currentPage - delta);
        let endPage = Math.min(totalPages, pagination.currentPage + delta);

        if (endPage - startPage + 1 < 2 * delta + 1) {
            if (startPage === 1) {
                endPage = Math.min(totalPages, startPage + 2 * delta);
            } else {
                startPage = Math.max(1, endPage - 2 * delta);
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            visiblePages.push(i);
        }

        return { visiblePages, startPage, endPage };
    };

    const { visiblePages } = getVisiblePages();

    const handleFirstPage = () => handlePageChange(1);
    const handlePrevPage = () => handlePageChange(pagination.currentPage - 1);
    const handleNextPage = () => handlePageChange(pagination.currentPage + 1);
    const handleLastPage = () => handlePageChange(totalPages);

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <>
            <div className="history-content_historyLayout">
                <h2 className="history-content_pageTitle">History</h2>
                <div className="history-content_historyLayoutContent">
                    <div className="history-content_tabsWrapper">
                        <div>
                            <div className="tabs_tabsHeader">
                                <button className="tabs_tabsItem tabs_active">Operations</button>
                                <button className="tabs_tabsItem tabs_inActive">Casino</button>
                            </div>
                        </div>

                        {totalPages > 1 && (
                            <div className="pagination_pagination">
                                {pagination.currentPage > 1 && (
                                    <>
                                        <button className="pagination_paginationButton" onClick={handleFirstPage}>
                                            <img src={IconDoubleLeft} alt="first" width={12} />
                                        </button>
                                        <button className="pagination_paginationButton" onClick={handlePrevPage}>
                                            <img src={IconChevronLeft} alt="next" width={20} />
                                        </button>
                                    </>
                                )}

                                {visiblePages.map((page) => (
                                    <span
                                        key={page}
                                        className="pagination_paginationCurrentValue"
                                        onClick={() => handlePageChange(page)}
                                    >
                                        {page}
                                    </span>
                                ))}

                                {pagination.currentPage < totalPages && (
                                    <>
                                        <button className="pagination_paginationButton" onClick={handleNextPage}>
                                            <img src={IconChevronRight} alt="first" width={12} />
                                        </button>
                                        <button className="pagination_paginationButton" onClick={handleLastPage}>
                                            <img src={IconDoubleRight} alt="next" width={12} />
                                        </button>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="history-content_content">
                        <div className="history-content_historyLayoutFilters">
                            <div className="history-content_historyLayoutFiltersHeader">
                                <button className="button_button button_ghost button_md history-content_filtersVisibilityBtn" onClick={() => setShowHistory(!showHistory)}>
                                    {showHistory ? "Hide" : "Show"} filters
                                    <img src={IconFilter} />
                                </button>
                            </div>
                            {
                                showHistory && <div onSubmit={handleSubmit}>
                                    <div className="history-operations-filters_filters">
                                        <div className="history-operations-filters_filterItem">
                                            <CustomFromInput />
                                            {showFromCalendar && (
                                                <div className="calendar-popup">
                                                    <Calendar
                                                        value={filters.dateFrom}
                                                        onChange={(date) => {
                                                            handleDateChange(date, "dateFrom");
                                                            setShowFromCalendar(false);
                                                        }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                        <div className="history-operations-filters_filterItem">
                                            <CustomToInput />
                                            {showToCalendar && (
                                                <div className="calendar-popup">
                                                    <Calendar
                                                        value={filters.dateTo}
                                                        onChange={(date) => {
                                                            handleDateChange(date, "dateTo");
                                                            setShowToCalendar(false);
                                                        }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                        <button
                                            className="button_button button_zeusPrimary button_md history-operations-filters_filtersSubmitBtn"
                                            onClick={() => handleSubmit()}
                                        >
                                            Search
                                        </button>
                                    </div>
                                </div>
                            }
                        </div>
                        {loading ? (
                            <DivLoading />
                        ) : transactions.length > 0 ? (
                            <div className="table_tableWrapper">
                                <table className="table_table">
                                    <thead>
                                        <tr>
                                            <td className="table_tableHeadCell" align="left">Date</td>
                                            <td className="table_tableHeadCell" align="left">Type</td>
                                            <td className="table_tableHeadCell" align="left">Balance before</td>
                                            <td className="table_tableHeadCell" align="left">Balance after</td>
                                            <td className="table_tableHeadCell" align="left">Amount</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {transactions.map((txn, index) => (
                                            <tr className="table_tableRow" key={"txn" + index}>
                                                <td className="table_tableCell" align="left">{formatDateDisplay(txn.created_at)}</td>
                                                <td className="table_tableCell" align="left">{formatOperation(txn.operation)}</td>
                                                <td className="table_tableCell" align="left">{formatBalance(txn.value_before)}</td>
                                                <td className="table_tableCell" align="left">{formatBalance(txn.value_after)}</td>
                                                <td className="table_tableCell" align="left">{formatBalance(txn.value)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="pay-history-mobile">
                                The transaction history is empty
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </>
    );
};

export default ProfileHistory;