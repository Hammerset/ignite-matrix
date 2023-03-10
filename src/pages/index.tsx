import { type NextPage } from "next";
import Head from "next/head";

import { api, trpc } from "../utils/api";
import styled from "styled-components";
import { useCallback, useState } from "react";
import { UploadJsonFileButton } from "../components/UploadJsonFileButton";
import type { JsonData } from "../components/UploadJsonFileButton/UploadJsonFileButton";
import { IgniteMatrix } from "../components/IgniteMatrix/IgniteMatrix";

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  height: 100%;
  width: 100%;

  max-width: 1200px;
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

const ButtonWrapper = styled.div`
  display: flex;
  gap: 1rem;
`;

const Button = styled.button``;

const Home: NextPage = () => {
  const [jsonData, setJsonData] = useState<JsonData | undefined>(undefined);
  const trpcContext = trpc.useContext();

  const { data: suppliers } = api.supplier.getAllValidSuppliers.useQuery();

  const createSuppliersMutation = api.supplier.createManySuppliers.useMutation({
    onSuccess() {
      // invalidate query
      trpcContext.supplier.getAllValidSuppliers.invalidate().catch((err) => {
        console.error(err);
      });
    },
  });

  const deleteAllSuppliersMutation =
    api.supplier.deleteAllSuppliers.useMutation({
      onSuccess() {
        // invalidate query
        trpcContext.supplier.getAllValidSuppliers.invalidate().catch((err) => {
          console.error(err);
        });
      },
    });

  const handleCreateSuppliers = useCallback(() => {
    if (!jsonData) return;

    createSuppliersMutation.mutate(
      jsonData.columns.map((item) => {
        return {
          name: item.key,
          ebitMargin: item.totals[0] ?? undefined,
          shareOfWallet: item.totals[1] ?? undefined,
          spend: item.totals[2] ?? undefined,
        };
      })
    );
  }, [jsonData, createSuppliersMutation]);

  const handleDeleteAllSuppliers = useCallback(() => {
    deleteAllSuppliersMutation.mutate();
  }, [deleteAllSuppliersMutation]);

  return (
    <>
      <Head>
        <title>Ignite Matrix</title>
        <meta name="description" content="Ignite Matrix" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Wrapper>
        <Content>
          <h1>Ignite Matrix</h1>

          <IgniteMatrix suppliers={suppliers ?? []} />

          <ButtonWrapper>
            <UploadJsonFileButton setJsonData={setJsonData} />
            <Button
              disabled={!jsonData}
              onClick={() => handleCreateSuppliers()}
            >
              Create Suppliers
            </Button>

            <Button
              disabled={!suppliers?.length}
              onClick={() => handleDeleteAllSuppliers()}
            >
              Delete all suppliers
            </Button>
          </ButtonWrapper>
        </Content>
      </Wrapper>
    </>
  );
};

export default Home;
