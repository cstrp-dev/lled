import { Toaster } from "@/view/components/ui/sonner";
import { DefaultLayout } from "./view/layouts/Default";
import { IdeaColumns } from "./view/components";

export const App = () => {
	return (
		<DefaultLayout>
			<div className="container mx-auto">
				<IdeaColumns />
			</div>
			<Toaster />
		</DefaultLayout>
	);
};
