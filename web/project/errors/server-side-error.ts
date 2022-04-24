export interface ServerSideErrorProps {
  error: ServerSideError;
}

export interface ServerSideError {
  status: number;
  message: string;
}

export const isServerSideErrorProps = (v: any): v is ServerSideErrorProps => {
  return 'error' in v;
};

export const toServerSideError = (error: any) => ({
  status: error.status ?? 500,
  message: error.data?.message ?? '',
});
