import Header from "../../components/Header";
import Table from "./Table";
import { useNavigate } from "react-router-dom";
import CreateButton from "../../components/Buttons/CreateButton";
import FiltersBlock from "../../components/FiltersBlock";
import { useEffect, useState } from "react";
import SearchInput from "../../components/SearchInput";
import PermissionWrapper from "../../components/PermissionWrapper";
import FilterSelect from "../../components/Selects/FilterSelect";
import listToOptions from "../../utils/listToOptions";
import clientTypeService from "../../services/clientTypeService";
import roleService from "../../services/roleService";

const UsersPage = () => {
  const navigate = useNavigate();
  const [roleOption, setRoleOption] = useState([]);
  const [typeOption, setTypeOption] = useState([]);
  const [roleSelect, setRoleSelect] = useState("");
  const [searchText, setSearchText] = useState("");
  const [value, setValue] = useState("");
  
  const fetchClientType = () => {
    clientTypeService.getList().then((res) => {
      let client_types = listToOptions(res.client_types, "name", "id");
      setTypeOption(client_types);
    });
  };

  const getRole = (value) => {
    const query = {
      "client-platform-id": "7d4a4c38-dd84-4902-b744-0488b80a4c01",
      "client-type-id": value,
    };
    roleService.getList(query).then((res) => {
      let roles = listToOptions(res.roles, "name", "id");
      setRoleOption(roles);
    });
  };

  useEffect(() => {
    setValue(typeOption?.find((item) => item.label === "DEV")?.value);
  }, [typeOption]);

  useEffect(() => {
    getRole(value);
  }, [value]);

  useEffect(() => {
    fetchClientType();
  }, []);

  return (
    <div className="UsersPage">
      <Header
        title="Users"
        extra={
          <PermissionWrapper permission="SETTINGS/USERS/CREATE">
            <CreateButton
              onClick={() => navigate(`/settings/users/create`)}
              title="Create user"
            />
          </PermissionWrapper>
        }
      />
      <FiltersBlock
        extra={[
          <FilterSelect
            onChange={(e) => setValue(e.target.value)}
            label="Type"
            width="120px"
            value={value}
            options={typeOption}
          />,
          <FilterSelect
            onChange={(e) => setRoleSelect(e.target.value)}
            label="Role"
            width="120px"
            options={roleOption}
          />,
        ]}
      >
        <SearchInput value={searchText} onChange={setSearchText} />
      </FiltersBlock>
      <div className="p-2">
        <Table searchText={searchText} roleSelect={roleSelect} />
      </div>
    </div>
  );
};

export default UsersPage;
