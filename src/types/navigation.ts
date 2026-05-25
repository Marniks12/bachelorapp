import { Analysis } from '../api/analysisApi';

export type RootStackParamList = {
  SignUp: undefined;
  Login: undefined;
  Dashboard: undefined;
  Home: undefined;
  InfoCarousel: undefined;
  Camera: undefined;
  Loading: undefined;
  Result: {
    analysis: Analysis;
  };
  AnalysisDetails: {
    analysis: Analysis;
  };
  ResultDetail: {
    analysis: Analysis;
  };
  OldAnalysis: undefined;
  AnalysisOverview: undefined;
  DashboardNewUser: undefined;
};
