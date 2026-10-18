import Button from "../../ui/Button";
import Modal from "../../ui/Modal";


function AddCabin({ setCabinToEdit }) {
  return (
    <Modal.Toggle opens="cabin-form">
      <Button onClick={() => setCabinToEdit(null)}>Add new cabin</Button>
    </Modal.Toggle>
  );
}

export default AddCabin;