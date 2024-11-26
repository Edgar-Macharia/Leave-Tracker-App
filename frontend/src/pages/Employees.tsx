import Breadcrumb from '../components/Breadcrumb';
import List from '../components/List';

const Employees = () => {
  return (
    <>
      <Breadcrumb pageName="Employees" />

      <div>
        <List />
      </div>
    </>
  );
};

export default Employees;
