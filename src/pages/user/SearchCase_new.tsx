import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  startAt,
  endAt,
} from "firebase/firestore";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Card,
  CardContent,
  CardActions,
  AppBar,
  Toolbar,
  CircularProgress,
  Chip,
  Grid,
} from "@mui/material";
import { db } from "../../services/firebase";
import { useAuth } from "../../auth/AuthContext";
import { logout } from "../../services/authService";

interface CaseItem {
  id: string;
  title: string;
  category: string;
  date: string;
  status?: string;
}

const SearchCase: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<CaseItem[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setLoading(true);

    try {
      const casesRef = collection(db, "cases");

      const q = query(
        casesRef,
        orderBy("title"),
        startAt(searchTerm),
        endAt(searchTerm + "\uf8ff")
      );

      const snapshot = await getDocs(q);
      const matches: CaseItem[] = [];

      snapshot.forEach((doc) => {
        const data = doc.data();
        matches.push({
          id: doc.id,
          title: data.title,
          category: data.category,
          date: data.date,
          status: data.status || "open",
        });
      });

      setResults(matches);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "success";
      case "in progress":
        return "warning";
      case "pending review":
        return "info";
      case "open":
        return "primary";
      default:
        return "default";
    }
  };

  return (
    <Box>
      {/* Header */}
      <AppBar position="static" sx={{ bgcolor: "#d32f2f" }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Search Cases
          </Typography>
          <Button color="inherit" onClick={() => navigate("/user/dashboard")}>
            Dashboard
          </Button>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Box p={3}>
        <Typography variant="h4" gutterBottom>
          Search Cases
        </Typography>

        <Paper sx={{ p: 3, mb: 3 }}>
          <Box component="form" onSubmit={handleSearch}>
            <Grid container spacing={2} alignItems="center">
              <Grid size={{ xs: 12, md: 9 }}>
                <TextField
                  fullWidth
                  label="Search cases by title, category, or content"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  variant="outlined"
                />
              </Grid>
              <Grid size={{ xs: 12, md: 3 }}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : "Search"}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" p={4}>
            <CircularProgress />
            <Typography ml={2}>Searching cases...</Typography>
          </Box>
        ) : results.length === 0 && searchTerm ? (
          <Paper sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="h6" color="textSecondary">
              No matching cases found.
            </Typography>
            <Typography variant="body2" color="textSecondary" mt={1}>
              Try adjusting your search terms or browse categories.
            </Typography>
          </Paper>
        ) : searchTerm && results.length > 0 ? (
          <Grid container spacing={3}>
            {results.map((item) => (
              <Grid size={{ xs: 12, md: 6, lg: 4 }} key={item.id}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    cursor: "pointer",
                    transition: "transform 0.2s",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: 3,
                    },
                  }}
                  onClick={() => navigate(`/user/view-case/${item.id}`)}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="h2" gutterBottom>
                      {item.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      gutterBottom
                    >
                      {item.category} • {item.date}
                    </Typography>
                    {item.status && (
                      <Chip
                        label={item.status}
                        color={getStatusColor(item.status) as any}
                        size="small"
                        sx={{ mt: 1 }}
                      />
                    )}
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/user/view-case/${item.id}`);
                      }}
                    >
                      View Details
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Paper sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="h6" color="textSecondary">
              Enter a search term to find cases
            </Typography>
            <Typography variant="body2" color="textSecondary" mt={1}>
              Search by case title, category, or content keywords.
            </Typography>
          </Paper>
        )}
      </Box>
    </Box>
  );
};

export default SearchCase;
