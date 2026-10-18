import CabinTable from "../features/cabins/CabinTable";
import Heading from "../ui/Heading";
import Row from "../ui/Row";
import AddCabin from "../features/cabins/AddCabin"
import { useState } from "react";
import CabinForm from "../features/cabins/CabinForm";
import Modal from "../ui/Modal";
// import StarRating from "../ui/StarRating";


function Cabins() {
  const [cabinToEdit, setCabinToEdit] = useState(null);
  console.log(cabinToEdit, 'look here')

  return (
    <Modal >

      <Row type="horizontal">
        <Heading as="h1">All cabins</Heading>

        <AddCabin setCabinToEdit={setCabinToEdit} />
      </Row>
      {/* <Row>
        <StarRating />
      </Row> */}

      <Row>
        <CabinTable
          cabinToEdit={cabinToEdit}
          setCabinToEdit={setCabinToEdit}
        />
      </Row>

      <Modal.Window name="cabin-form">
        <CabinForm cabinToEdit={cabinToEdit} />
      </Modal.Window>

    </Modal>
  );
}

export default Cabins;
