import React, { useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useDispatch, useSelector } from 'react-redux';
import { FloatButton, Spin } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';
import img1 from '../../../assets/images/logo/RENUKA.png';

const GSTInvoice = () => {
  const dispatch = useDispatch();
  const invoiceData = useSelector((state) => state.Order.state.viewOrderData);
  const invoiceData2 = useSelector((state) => state.Order.data?.invoicedata?.data);
  const itemdata = useSelector((state) => state.Order.data?.itemList?.data);
  console.log(itemdata);

  useEffect(() => {
    if (itemdata && itemdata.length === 0) {
      dispatch(getItem());
    }
  }, [dispatch, itemdata]);

  const loading = useSelector((state) => state.Order.data.loading2);

  const total23 = invoiceData2?.reduce((acc, item) => {
    return acc + (item?.QTY * item?.RATE || 0);
  }, 0) || 0;

  const gstPercentage = invoiceData2 && invoiceData2.length > 0 && Array.isArray(itemdata)
  ? itemdata.find(i => i.ID === invoiceData2[0]?.ITEM_ID)?.GST_PERCENT || 0
  : 0;

  const totalGstAmount = (invoiceData2 || []).reduce((total, item) => {
    const itemTotal = item?.QTY * item?.RATE || 0;
    const matchingItem = Array.isArray(itemdata)
      ? itemdata.find(i => i.ID === item?.ITEM_ID)
      : null;
    const gstPercentage = matchingItem ? matchingItem.GST_PERCENT : 0;
    const gstItemAmount = itemTotal * (gstPercentage / 100);
    return total + gstItemAmount;
  }, 0);
  
  const totalAmountWithoutGst = (invoiceData2 || []).reduce((total, item) => {
    return total + (item?.QTY * item?.RATE || 0);
  }, 0);
  
  const totalAmountWithGst = totalAmountWithoutGst + totalGstAmount + (invoiceData?.FINE_AMOUNT || 0);

  const invoiceRef = useRef();

  const handleDownloadPdf = () => {
    const input = invoiceRef.current;
    html2canvas(input, { scale: 3 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdfWidth = 200; // mm
      const pdfHeight = 280; // mm
      const pdf = new jsPDF('p', 'mm', [pdfWidth, pdfHeight]);
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`${invoiceData.ORDER_NO}_invoice.pdf`);
    });
  };

  const styles = {
    container: {
      width: '80%',
      maxWidth: '800px',
      margin: '0 auto',
      padding: '30px',
      border: '1px solid #ddd',
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
      fontFamily: "'Helvetica Neue', 'Arial', sans-serif",
      backgroundColor: '#fff',
      color: '#333',
      borderRadius: '8px',
    },
    header: {
      textAlign: 'center',
    },
    logo: {
      width: '90px',
    },
    companyDetails: {
      marginTop: '-2ch',
      fontSize: '0.8rem',
      color: '#666',
    },
    section: {
      marginBottom: '30px',
    },
    sectionTitle: {
      fontSize: '0.9rem',
      fontWeight: 'bold',
      marginBottom: '10px',
      color: '#007bff',
    },
    sectionTitle2: {
      marginTop: '20px',
      fontSize: '0.9rem',
      fontWeight: 'bold',
      marginBottom: '15px',
      color: '#007bff',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
    },
    tableHeader: {
      backgroundColor: '#f8f9fa',
      fontWeight: 'bold',
    },
    tableCell: {
      padding: '4px',
      paddingLeft: '10px',
      paddingRight: '10px',
      border: '1px solid #ddd',
      textAlign: 'left',
      fontSize: '0.8rem',
    },
    tableCell2: {
      padding: '4px',
      paddingLeft: '10px',
      paddingRight: '10px',
      border: '1px solid #ddd',
      textAlign: 'left',
      color: 'red',
      fontSize: '0.8rem',
    },
    footer: {
      fontSize: '0.8rem',
      color: '#666',
      textAlign: 'center',
      borderTop: '1px solid #ddd',
      paddingTop: '10px',
    },
    totalContainer: {
      marginTop: '20px',
      textAlign: 'right',
    },
    totalLabel: {
      fontWeight: 'bold',
      fontSize: '1rem',
      marginRight: '10px',
    },
    fineLabel: {
      fontWeight: 'bold',
      fontSize: '1rem',
      marginRight: '10px',
      marginBottom: '5px',
    },
    fineAmount: {
      fontWeight: 'bold',
      fontSize: '1rem',
      color: '#ff9800',
    },
    totalAmount: {
      fontWeight: 'bold',
      fontSize: '1rem',
      color: 'red',
    },
    headerDetails: {
      display: 'flex',
      justifyContent: 'space-between',
      textAlign: 'left',
    },
  };

  if (!invoiceData) {
    return <div className="p-4 text-center">No order selected for invoice.</div>;
  }

  return (
    <div>
      {loading ? (
        <div className="w-full flex justify-center h-60 items-center">
          <Spin size="large" />
        </div>
      ) : (
        <>
          <div ref={invoiceRef} style={styles.container}>
            <div style={styles.header}>
              <img src={img1} alt="Company Logo" style={styles.logo} />
              <div style={styles.companyDetails}>
                <h2 style={styles.sectionTitle}>Invoice Details</h2>
              </div>
            </div>

            <div style={styles.headerDetails}>
              <div>
                <p><strong>Order:</strong> {invoiceData.ORDER_NO}</p>
                <p><strong>Issued:</strong> {invoiceData.ORDER_DATETIME}</p>
                <p><strong>Due:</strong> {invoiceData.ORDER_ENDTIME}</p>
              </div>
              <div>
                <p><strong>Bill To:</strong> {invoiceData.CUSTOMER_NAME}</p>
                <p><strong>Address:</strong> {invoiceData.ADDRESS}</p>
                <p><strong>Mobile No:</strong> {invoiceData.MOBILE_NO}</p>
              </div>
            </div>


            <div style={styles.section}>
              <h2 style={styles.sectionTitle2}>Payment Breakdown</h2>

              <table style={styles.table}>
                <thead>
                  <tr style={styles.tableHeader}>
                    <th style={styles.tableCell}>Item</th>
                    <th style={styles.tableCell}>Rate</th>
                    <th style={styles.tableCell}>Quantity</th>
                    <th style={styles.tableCell}>Amount</th>
                    <th style={styles.tableCell}>GST</th>
                    <th style={styles.tableCell}>Total with GST</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceData2 && invoiceData2.map((item, index) => {
                    const itemTotal = item?.QTY * item?.RATE || 0;
                    const matchingItem = Array.isArray(itemdata)
                        ? itemdata.find(i => i.ID === item?.ITEM_ID)
                        : null;
                    const gstPercentage = matchingItem ? matchingItem.GST_PERCENT : 0; 
                    const gstItemAmount = (itemTotal * (gstPercentage / 100)).toFixed(2); 
                    const totalWithGst = (parseFloat(itemTotal) + parseFloat(gstItemAmount)).toFixed(2); 
                    return (
                    <tr key={index}>
                      <td style={styles.tableCell}>{item?.ITEM_NAME}</td>
                      <td style={styles.tableCell}>₹{item?.RATE}</td>
                      <td style={styles.tableCell}>{item?.QTY}</td>
                      <td style={styles.tableCell}>₹{itemTotal}</td>
                      <td style={styles.tableCell}>₹{gstItemAmount}</td> 
                      <td style={styles.tableCell}>₹{totalWithGst}</td>
                    </tr>
                  );
                  })}
                </tbody>
              </table>
            </div>

            {/* Fine and Total section */}
            <div style={styles.totalContainer}>
              <div>
                <span style={styles.gstLabel}>GST @ {gstPercentage}%:</span>
                <span style={styles.gstAmount}>₹{totalGstAmount.toFixed(2)}</span>
              </div>
              {/* <div>
                <span style={styles.fineLabel}>Fine Amount:</span>
                <span style={styles.fineAmount}>₹{invoiceData?.FINE_AMOUNT}</span>
              </div> */}
              <div>
                <span style={styles.totalLabel}>Total Amount:</span>
                <span style={styles.totalAmount}>₹{totalAmountWithGst.toFixed(2)}</span>
              </div>
            </div>

            <div style={styles.footer}>
              <p><strong>Created By:</strong> {invoiceData.CREATED_BY_NAME}</p>
            </div>
          </div>

          <FloatButton
            onClick={handleDownloadPdf}
            icon={<FileTextOutlined />}
            shape="square"
            type="primary"
            style={{
              insetInlineEnd: 24 + 70,
            }}
          />
        </>
      )}
    </div>
  );
};

export default GSTInvoice;
