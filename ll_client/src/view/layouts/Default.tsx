export const DefaultLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="min-h-svh flex flex-col bg-gray-50">
			<main className="flex-grow p-4">{children}</main>
		</div>
	);
};
