import { type NextPage } from "next";
import Head from "next/head";

import { api } from "../utils/api";
import styled from "styled-components";
import { useCallback, useState } from "react";
import { UploadJsonFileButton } from "../components/UploadJsonFileButton";
import { JsonData } from "../components/UploadJsonFileButton/UploadJsonFileButton";

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  height: 100%;
  width: 100%;
`;

const ButtonWrapper = styled.div``;

const Button = styled.button``;

const Home: NextPage = () => {
  const [jsonData, setJsonData] = useState<JsonData | undefined>(undefined);

  const createSuppliersMutation =
    api.supplier.createManySuppliers.useMutation();

  const handleCreateSuppliers = useCallback(async () => {
    if (!jsonData) return;

    createSuppliersMutation.mutate(
      jsonData.columns.map((item) => {
        return {
          name: item.key,
          ebitMargin: item.totals[0] ?? undefined,
          revenue: item.totals[1] ?? undefined,
          profit: item.totals[2] ?? undefined,
        };
      })
    );
  }, [jsonData]);

  return (
    <>
      <Head>
        <title>Ignite Matrix</title>
        <meta name="description" content="Ignite Matrix" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Content>
        <h1>Ignite Matrix</h1>

        <div>Ignite matrix placeholder</div>

        <ButtonWrapper>
          <UploadJsonFileButton setJsonData={setJsonData} />
          <Button disabled={!jsonData} onClick={() => handleCreateSuppliers()}>
            Create Suppliers
          </Button>
        </ButtonWrapper>
      </Content>
    </>
  );
};

export default Home;
