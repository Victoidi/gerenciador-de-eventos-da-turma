export type PublicationActionState = {
  message?: string;
  errors?: string[];
};

export const EMPTY_PUBLICATION_ACTION_STATE: PublicationActionState = {
  message: "",
  errors: []
};
