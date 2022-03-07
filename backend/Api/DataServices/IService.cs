namespace Api.DataServices;

public interface IService<T>
{
    Task<T> Get(string id);
    Task<T> Update(T item);
    Task Delete(string id);
    Task<List<T>> GetAll();
    Task<List<T>> GetAllForAParent(string id);
}
