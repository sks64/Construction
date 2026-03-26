import React from "react";

const OfferLetter = React.forwardRef(({ selectedEmployee }, ref) => (
  <div className="mx-6" ref={ref}>
    <div className="p-12 font-poppins leading-normal">
      <div className="text-center mb-5"></div>
      <div className="mb-5">
        <p className="text-lg mb-5">To,</p>
        <p className="text-lg mb-5">
          Mr/Miss -{" "}
          {`${selectedEmployee?.FIRST_NAME} ${
            selectedEmployee?.MIDDLE_NAME ? selectedEmployee?.MIDDLE_NAME : ""
          } ${selectedEmployee?.LAST_NAME ? selectedEmployee?.LAST_NAME : ""}`}
        </p>
        <p className="text-lg mb-5">Sub: Letter of Offer</p>
      </div>
      <p className="text-2xl font-bold mb-5 text-center text-blue-400">
        CONGRATULATIONS!
      </p>
      <p className="text-xl mb-2.5">
        Thank you for exploring career opportunities with 5TECHG Lab LLP. You
        have successfully completed our initial selection process and we are
        pleased to make you an offer.
      </p>
      <p className="text-xl mb-2.5">
        This offer is based on your Academic Performance in the selection
        process. You have been selected for the position of{" "}
        <span className="font-bold">{selectedEmployee?.DESIGNATION}</span>,
        your monthly salary will be <span className="font-bold">{selectedEmployee?.SALARY}</span>,
        your branch will be <span className="font-bold">{selectedEmployee?.BRANCH_NAME}</span> , and your department will be <span className="font-bold">{selectedEmployee?.DEPARTMENT_NAME}</span> 
       {' '}which is subject to change as per the business requirement.
      </p>
      <p className="text-xl mb-2.5">
        We are pleased to inform you that your job will commence on{" "}
        <span className="font-bold">{selectedEmployee?.DOJ}</span> with 8 hours
        daily and a 6-day work week. If you take leave, it will not be included
        as a working day.
      </p>
      <p className="text-xl mb-2.5">
        <span className="font-bold">Leave Policy:</span> If you take a leave
        day, that day will not be counted as a working day.
      </p>
      <p className="text-xl mb-2.5">
        Kindly confirm your acceptance of this offer over an email. If not
        accepted within 7 days, it will be considered that you are not
        interested in this employment and this offer letter will be considered
        as withdrawn.
      </p>
      <br />
      <p className="mt-5 text-xl text-right">
        With warm regards,
        <br />
        Yours Sincerely,
        <br />
        MR. RUSHIKESH KOLI
        <br />
        CEO, 5TECHG LAB LLP
      </p>
    </div>
  </div>
));

export default OfferLetter;
