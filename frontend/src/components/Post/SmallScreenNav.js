import { useState } from "react";

const ActionModal = ({ onClose }) => (
  <div className="z-80 fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-5 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold">Action Modal</h2>
      <button
        onClick={onClose}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
      >
        Close
      </button>
    </div>
  </div>
);

const ComedyModal = ({ onClose }) => (
  <div className="z-80 fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-5 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold">Comedy Modal</h2>
      <button
        onClick={onClose}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
      >
        Close
      </button>
    </div>
  </div>
);

const SmallScreenNav = () => {
  const [modalType, setModalType] = useState(null);

  const items = [
    { key: "company", title: "Company", component: ActionModal },
    { key: "location", title: "Location", component: ComedyModal },
  ];

  const ModalComponent = items.find(
    (item) => item.key === modalType
  )?.component;

  return (
    <>
      <div className="sm:hidden flex px-6 text-2xl whitespace-nowrap space-x-6 overflow-x-auto scrollbar-hide mt-4">
        {items.map(({ key, title }) => (
          <h2
            key={key}
            onClick={() => setModalType(key)}
            className="last:pr-22 text-xs cursor-pointer border bg-gray-200 py-1 rounded-full px-5"
          >
            {title}
          </h2>
        ))}
      </div>

      {ModalComponent && <ModalComponent onClose={() => setModalType(null)} />}
    </>
  );
};

export default SmallScreenNav;
