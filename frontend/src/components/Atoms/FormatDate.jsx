// const FormatDate = () => {
//   const formatDate = (isoDate) => {
//     if (!isoDate) return "N/A";
//     const date = new Date(isoDate);
//     return new Intl.DateTimeFormat("en-US", {
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//     }).format(date);
//   };
//   return formatDate;
// };

// export default FormatDate;


const useFormatDate = (isoDate) => {
    if (!isoDate) return "N/A";
  
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(isoDate));
  };
  
  export default useFormatDate;