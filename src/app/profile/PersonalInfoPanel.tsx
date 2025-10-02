import {
  useEffect,
  useState,
  useRef
} from "react";
import { MdOutlineEdit, MdOutlineRestartAlt, MdOutlineSave, MdOutlineSaveAlt } from "react-icons/md";
import { fetchBackend } from "@/lib/api";
import FormInput from "./FormInput";
import { useAuthContext } from "@/context/AuthContext";

/**
 * contains personal information, for changing display name, email and password
 */
export default function PersonalInforPanel(){
  interface PersonalInformation {
    name: string;
    email: string;
  }

  const [personalInfo, setPersonalInfo] = useState<PersonalInformation>({
    name: "",
    email: "",
  });

  const { setUserName } = useAuthContext();

  const [nameInput, setNameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [newPasswordInput, setNewPasswordInput] = useState<string | null>(null);
  const [oldPasswordInput, setOldPasswordInput] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(()=>{
    const getPersonalInfo = async () => {
      const response = await fetchBackend("user/me", "GET");
      if(response.success && response.data) {
        setPersonalInfo(response.data);
        setNameInput(response.data.name);
        setEmailInput(response.data.email);
      }
    }

    getPersonalInfo();
  }, [])

  const { name, email } = personalInfo;

  return (
    <div
      className="flex flex-col gap-4 justify-start items-center
      bg-background-medium
      border-highlight-muted border-2
      border-solid rounded-md
      sm:p-4 sm:pb-8 sm:px-8"
    >
      <p className="font-bold text-center text-3xl my-4">
        Personal Information
      </p>

      <form
        ref={formRef}
        onChange={handleChange}
        className="flex flex-col
        sm:[&>div]:flex-col sm:[&>div]:flex
        sm:gap-4 sm:sm:[&>div]:gap-1
        sm:[&_svg]:text-2xl
        "
      >
        <div>
          <FormInput type='text' label="Display Name"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
          />

          {nameInput.trimEnd() != name.trimEnd() && <EditPersonalInfoMiniPanel
            handleReset={()=>setNameInput(name)}
            handleEdit={handleEdit}
          />}
        </div>

        <div>
          <FormInput type='email' label="Email" editable={false}
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
          />

          {emailInput.trimEnd() != email.trimEnd() && <EditPersonalInfoMiniPanel
            handleReset={()=>setEmailInput(email)}
            handleEdit={handleEdit}
          />}
        </div>

        <div>
          <FormInput type='password' label="Old Password"
            onChange={(e) => setOldPasswordInput(e.target.value)}
          />

          <FormInput type='password' label="New Password"
            onChange={(e) => setNewPasswordInput(e.target.value)}
          />

          { (newPasswordInput && oldPasswordInput) && (<div
            className="flex-row-center mt-2"
          >
            <button
              type="button"
              onClick={handleEdit}
              title="Update Password"
              className="flex flex-row
              hover:[&_p]:block"
            >
              <MdOutlineSave/>
              <p className="hidden">
                Update Password
              </p>
            </button>
          </div>)}

        </div>

      </form>
    </div>
  );

  function handleChange(e: React.SyntheticEvent<HTMLFormElement>) {
    // console.log(e);
  }

  async function handleEdit(){
    interface UpdateInfoBody {
      name: string;
      email: string;
      new_password?: string;
      old_password?: string;
    }

    const body: UpdateInfoBody = {
      name: nameInput,
      email: emailInput,
    }
    if(newPasswordInput && oldPasswordInput) {
      body["new_password"] = newPasswordInput;
      body["old_password"] = oldPasswordInput;
    }

    const response = await fetchBackend(
      'auth/update',
      "PUT",
      JSON.stringify(body),
      new Headers({"Content-Type": "application/json"})
    );

    if(response.success) {
      setPersonalInfo({
        name: nameInput,
        email: emailInput
      });
      
      setUserName(nameInput);

      setOldPasswordInput(null);
      setNewPasswordInput(null);
      formRef.current?.reset();

      console.log(response);
      return;
    }

    alert(response.message);
  }
}

function EditPersonalInfoMiniPanel({handleReset, handleEdit}:{
  handleReset: () => void,
  handleEdit: () => void
}){
  return (
    <div className="flex-row-center gap-5">
      <button
        type="button"
        onClick={handleEdit}
      >
        <MdOutlineEdit/>
      </button>

      <button
        type="button"
        onClick={handleReset}
      >
        <MdOutlineRestartAlt/>
      </button>
    </div>

  );
}