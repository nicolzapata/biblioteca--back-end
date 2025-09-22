const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('es-ES');
};

const isOverdue = (dueDate) => {
  return new Date() > new Date(dueDate);
};

const getDaysBetween = (date1, date2) => {
  const diffTime = Math.abs(new Date(date2) - new Date(date1));
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

module.exports = {
  addDays,
  formatDate,
  isOverdue,
  getDaysBetween
};